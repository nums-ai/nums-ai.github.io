"""Build the homepage's Elo data and summary from the supplied CSV exports.

Elo and its asymmetric bounds are read directly, never re-estimated from losses.
The per-split file verifies the comparison's dataset, split, and method coverage.
"""

import argparse
import csv
import hashlib
import json
from collections import Counter, defaultdict
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VARIANTS = ("default", "tuned", "tuned_ensemble")
# Keep the selected tree and neural-network baselines stable across evaluations.
TREE_FAMILIES = {"CatBoost", "LightGBM", "XGBoost", "RandomForest", "ExtraTrees"}
NEURAL_FAMILIES = {"RealMLP_GPU", "TabM"}
BASELINE_FAMILIES = TREE_FAMILIES | NEURAL_FAMILIES


def source_info(path):
    return {"file": path.name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def read_inputs(leaderboard_path, splits_path):
    with leaderboard_path.open(newline="") as handle:
        source_rows = list(csv.DictReader(handle))
    rows = []
    for record in source_rows:
        elo, plus, minus = (Decimal(record[key]) for key in ("elo", "elo+", "elo-"))
        if not all(value.is_finite() for value in (elo, plus, minus)) or min(plus, minus) < 0:
            raise ValueError(f"Invalid Elo or bounds for {record['method']}")
        if record["method_subtype"] not in VARIANTS:
            raise ValueError(f"Unsupported configuration: {record['method_subtype']}")
        rows.append({
            "method": record["method"], "name": record["ta_name"],
            "variant": record["method_subtype"], "methodType": record["method_type"],
            "elo": float(elo), "plus": float(plus), "minus": float(minus),
            "lower": float(elo - minus), "upper": float(elo + plus),
        })
    if len({row["method"] for row in rows}) != len(rows):
        raise ValueError("Duplicate methods in the leaderboard")
    rows.sort(key=lambda row: (-row["elo"], row["method"]))
    for row in rows:
        # The source `rank` is an average task rank, not an ordinal Elo position.
        row["position"] = 1 + sum(other["elo"] > row["elo"] for other in rows)

    datasets, coverage, imputed_count = {}, defaultdict(set), 0
    with splits_path.open(newline="") as handle:
        for record in csv.DictReader(handle):
            dataset, fold, method = record["dataset"], record["fold"], record["method"]
            split = (dataset, fold)
            if split in coverage[method]:
                raise ValueError(f"Duplicate per-split result: {method}, {split}")
            coverage[method].add(split)
            problem_type = record["problem_type"]
            if dataset in datasets and datasets[dataset] != problem_type:
                raise ValueError(f"Conflicting problem types for {dataset}")
            datasets[dataset] = problem_type
            imputed_count += record["imputed"].lower() == "true"
    all_splits = set().union(*coverage.values())
    if set(coverage) != {row["method"] for row in rows}:
        raise ValueError("The leaderboard and per-split file contain different methods")
    if any(splits != all_splits for splits in coverage.values()):
        raise ValueError("Methods do not share the same evaluation splits")

    families = defaultdict(list)
    for row in rows:
        families[row["name"]].append(row)
    selected_names = BASELINE_FAMILIES | {"Causilo"}
    if not selected_names.issubset(families):
        raise ValueError(f"Missing comparison families: {selected_names - families.keys()}")
    for name in BASELINE_FAMILIES:
        if {row["variant"] for row in families[name]} != set(VARIANTS):
            raise ValueError(f"Incomplete comparison settings for {name}")
    selected_names = sorted(selected_names, key=lambda name: max(row["elo"] for row in families[name]))
    plotted = [{"name": name, "variants": families[name]} for name in selected_names]
    causilo = [row for row in rows if row["name"] == "Causilo" and row["variant"] == "default"]
    if len(causilo) != 1:
        raise ValueError("Expected exactly one Causilo default result")

    return {
        "sources": {"leaderboard": source_info(leaderboard_path), "splits": source_info(splits_path)},
        "datasetCount": len(datasets), "splitCount": len(all_splits),
        "configurationCount": len(rows), "familyCount": len(families),
        "plottedFamilyCount": len(plotted), "treeFamilyCount": len(TREE_FAMILIES),
        "neuralFamilyCount": len(NEURAL_FAMILIES),
        "plottedConfigurationCount": sum(len(family["variants"]) for family in plotted),
        "datasetTypes": dict(Counter(datasets.values())),
        "imputedResultCount": imputed_count,
        "methodTypes": sorted({row["methodType"] for row in rows}),
        "causilo": causilo[0], "leaders": rows[:3], "plottedFamilies": plotted,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--leaderboard", type=Path, required=True)
    parser.add_argument("--splits", type=Path, required=True)
    args = parser.parse_args()
    data = read_inputs(args.leaderboard, args.splits)
    (ROOT / "src/components/homepage/benchmark-data.json").write_text(json.dumps(data, indent=2) + "\n")
    print(json.dumps({key: data[key] for key in ("datasetCount", "splitCount", "configurationCount", "familyCount")}))
    print("Leading Elo results:", ", ".join(f"{row['name']} {row['elo']:,.1f}" for row in data["leaders"]))


if __name__ == "__main__":
    main()
