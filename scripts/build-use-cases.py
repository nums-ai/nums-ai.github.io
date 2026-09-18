"""Aggregate the supplied TabArena split results for the Use Cases page.

Keep scores on their native dataset metric. ROC AUC is 1 - metric_error;
log loss and RMSE are metric_error. Never pool unlike metrics across datasets.
"""

import argparse
import csv
import hashlib
import json
import math
import statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODELS = {
    "CAUSILO": "Causilo", "CAT": "CatBoost", "GBM": "LightGBM",
    "XGB": "XGBoost", "RF": "Random forest", "XT": "Extra trees",
    "LR": "Linear regression", "KNN": "K-nearest neighbors",
}
VARIANTS = ["default", "tuned", "tuned_ensemble"]


def build(splits_path, catalog_path, metadata_path):
    catalog = json.loads(catalog_path.read_text())
    metadata = json.loads(metadata_path.read_text())
    rows = list(csv.DictReader(splits_path.open(newline="")))
    names = {row["dataset"] for row in rows}
    if names != set(catalog) or names != set(metadata["datasets"]):
        raise ValueError("Dataset descriptions and metadata must cover the exact supplied dataset set")
    grouped = defaultdict(lambda: defaultdict(dict))
    signatures = defaultdict(set)
    for row in rows:
        if row["config_type"] not in MODELS:
            continue
        name, model, variant = row["dataset"], row["config_type"], row["method_subtype"]
        fold = int(row["fold"])
        key = (model, variant)
        if fold in grouped[name][key]:
            raise ValueError(f"Duplicate split: {name}, {key}, {fold}")
        if row["imputed"].lower() != "false":
            raise ValueError(f"Imputed result needs an explicit display policy: {name}, {key}, {fold}")
        error = float(row["metric_error"])
        if not math.isfinite(error) or error < 0 or (row["metric"] == "roc_auc" and error > 1):
            raise ValueError(f"Invalid error: {name}, {key}, {fold}")
        grouped[name][key][fold] = error
        signatures[name].add((row["metric"], row["problem_type"]))
    datasets = []
    for name, description in catalog.items():
        if len(signatures[name]) != 1:
            raise ValueError(f"Inconsistent task metadata: {name}")
        metric, problem = next(iter(signatures[name]))
        expected_metric = {"binary": "roc_auc", "multiclass": "log_loss", "regression": "rmse"}[problem]
        if metric != expected_metric:
            raise ValueError(f"Unexpected metric: {name}")
        source = metadata["datasets"][name]
        if source["problemType"] != problem:
            raise ValueError(f"Task type disagrees with source metadata: {name}")
        coverage = set(grouped[name][("CAUSILO", "default")])
        if len(coverage) != source["splits"]:
            raise ValueError(f"Unexpected split count: {name}")
        scores = {}
        for variant in VARIANTS:
            models = []
            for code, label in MODELS.items():
                if code == "LR" and problem != "regression":
                    label = "Logistic regression"
                model_variant = "default" if code == "CAUSILO" else variant
                values = grouped[name][(code, model_variant)]
                if set(values) != coverage:
                    raise ValueError(f"Unmatched evaluation splits: {name}, {code}, {variant}")
                score_values = [1 - values[fold] if metric == "roc_auc" else values[fold] for fold in sorted(coverage)]
                models.append({"family": code, "name": label, "mean": statistics.mean(score_values), "std": statistics.stdev(score_values)})
            scores[variant] = models
        datasets.append({"id": name, **description, **source, "metric": metric, "scores": scores})
    output = {
        "source": {"file": splits_path.name, "sha256": hashlib.sha256(splits_path.read_bytes()).hexdigest(), "rows": len(rows)},
        "datasetCount": len(datasets), "comparisonModelCount": len(MODELS) - 1,
        "evaluationSplits": sum(dataset["splits"] for dataset in datasets),
        "variants": VARIANTS, "datasets": datasets,
    }
    destination = ROOT / "src/components/use-cases/benchmark-data.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    print(f"Generated {len(datasets)} datasets, {output['evaluationSplits']} matched splits, {len(MODELS)} models, 3 comparison settings")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--splits", type=Path, required=True)
    parser.add_argument("--catalog", type=Path, default=ROOT / "data/use-cases/catalog.json")
    parser.add_argument("--metadata", type=Path, default=ROOT / "data/use-cases/dataset-metadata.json")
    args = parser.parse_args()
    build(args.splits, args.catalog, args.metadata)
