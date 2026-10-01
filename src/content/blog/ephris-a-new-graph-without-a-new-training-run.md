---
slug: ephris-a-new-graph-without-a-new-training-run
status: published
date: '2026-09-30'
author: Dooho Lee
readingMinutes: 7
title: 'Ephris: Stronger In-Context Learning on Graphs with Linear Scaling'
category: Research
summary: >-
  Ephris combines sparse message passing and synthetic pretraining to lead
  aggregate performance across 51 graph datasets, with computation that scales
  linearly in feature entries and edges.
cardSummary: >-
  Stronger graph in-context learning with sparse message passing and linear
  scaling.
hero:
  src: >-
    /blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-10a-elo-runtime.png
  alt: >-
    Original Elo–runtime Pareto plots: Ephris improves the upper-left
    performance–runtime frontier with 50% and 10% labeled context.
  width: 2400
  height: 1021
  minWidth: 640
  caption: >-
    Figure 10(a). Higher Elo and lower adaptation time are better. Ephris
    advances the frontier with both 50% and 10% labeled context.
figures:
  paper-figure-2-architecture.png:
    width: 912
    height: 252
    minWidth: 640
    caption: >-
      Figure 2. From feature tokens to label predictions: graph-aware refinement,
      compression, and message passing. Purple diamonds are learned global nodes.
  paper-figure-3-scaling.png:
    width: 653
    height: 452
    maxWidth: 380
    caption: >-
      Figure 3. Ephris scales nearly linearly over the measured range. The
      runtime gap widens as graphs grow; β near 1 indicates linear growth.
  paper-figure-4-elo.svg:
    width: 436.35319
    height: 140.76544
    minWidth: 640
    caption: >-
      Figure 4. Elo across 51 datasets. Higher is better; each pair of bars
      shows 50% and 10% labeled context. Intervals show uncertainty.
  paper-figure-6-subgroups.svg:
    width: 155.8486
    height: 147.3696
    maxWidth: 530
    caption: >-
      Figure 6. Average ranks by dataset property, with 50% labeled context.
      Farther out is better; N counts datasets in each group.
  paper-figure-5-performance-runtime.png:
    width: 2400
    height: 1040
    minWidth: 640
    caption: >-
      Figure 5. Lower is better on both axes. Ephris advances the
      performance–runtime frontier in both label settings.
---
**A graph already tells us how its nodes are connected. Can a pretrained model use those connections to learn from examples efficiently?**

Ephris is our answer: a graph in-context learner built around sparse message passing. Given a new graph and some known node labels, it predicts the remaining labels with its pretrained weights fixed.

The opening plot brings the result into view. Ephris advances the performance–runtime frontier across 51 datasets, combining stronger aggregate predictions with computation that scales linearly in feature entries and edges. The starting point was to reconsider an architectural choice inherited from tabular foundation models.

## What is graph in-context learning? {#show-it-the-task}

A tabular foundation model can predict missing labels in a new table using rows whose labels are already known. Those labeled rows form the *context*: examples that reveal the task. The pretrained model processes them without updating its weights for the new dataset.

**Graph in-context learning extends this idea to connected data.** Each node has features, like a row in a table, and edges describe relationships between nodes. Known node labels become context for predicting unknown ones.

Consider a collection of research papers. Papers are nodes, citations are edges, and numerical descriptions of the papers are features. Given topic labels for some papers, the model predicts topics for the rest. It receives:

- **Node features:** what we know about each paper.
- **Edges:** which papers cite one another.
- **Context labels:** examples of the topics to predict.

Features and connections are available for the full graph; query labels stay hidden. The model's representations change as it reads the context, while its weights stay fixed.

Early graph in-context learners built on tabular architectures. NodePFN adds a message-passing branch to TabPFN; GraphPFN adds graph-attention adapters to LimiX. These extensions bring graph information into established tabular models, while retaining their dense attention over context nodes.

## Does a graph need attention between every pair? {#use-the-connections}

Dense attention lets a tabular model compare rows and discover useful relationships among them. As the context grows, however, the number of pairwise comparisons grows quadratically. With a fixed labeled fraction, doubling the graph size creates roughly four times as many context pairs.

A graph gives us additional information: **explicit connections along which evidence can travel.** In the paper example, a citation supplies a plausible route for sharing information about topics.

Our hypothesis was that these routes could support in-context learning without dense attention across all node pairs. The model would still need to learn which connections matter for the current task, but it could make that decision within the graph's neighborhoods.

This led us to design Ephris around sparse message passing.

## Build in-context learning around message passing {#inside-ephris}

In Ephris, each node combines its own features with information from its neighbors. Known labels provide the context for predicting unknown ones.

The graph also helps prepare the features used for prediction:

![Original Ephris architecture diagram: feature tokenization, graph-aware refinement, compression, message passing with global nodes, and label prediction.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-2-architecture.png)

1. **Read the values.** Scalar features become learned tokens, and embeddings introduce the observed labels.
2. **Refine with the dataset and graph.** Shared summary tokens gather information about feature distributions. Node summaries exchange messages over the graph, then return the updates to the feature tokens.
3. **Compress each node.** The refined features become a fixed-size representation, allowing one model to handle datasets with different numbers of columns.
4. **Predict through message passing.** Stacked blocks combine features, connections, and labeled examples. A shared head converts the final query representations into class probabilities.

Graph structure thus guides both the information retained during compression and the communication used for prediction.

:::details[A few model details]

The evaluated model has 50.16 million parameters. It uses three feature-refinement blocks, compresses each node to 512 dimensions, and applies ten message-passing blocks. Each of the latter has eight global nodes.

The prediction head handles up to ten classes directly. For tasks with more classes, a fixed coding scheme breaks the task into smaller classification problems and combines their probabilities, using the same pretrained weights.

:::

## Teach one model many prediction rules {#practice-before-the-real-graph}

An efficient communication mechanism still needs to learn how to use examples. Ephris was pretrained on **3.84 million synthetic graph tasks**, with no real benchmark datasets used in pretraining.

The generator varies both graph structure and the relationships among features and labels. Graphs can contain communities, hubs, or route-like connections. Information can spread gradually, trigger a cascade, or influence nodes differently according to their connectivity.

Each task reveals some labels and asks the model to predict the rest. Across these tasks, the model practices inferring a prediction rule from a new set of examples.

The next question is how well that practice transfers to real datasets.

## Stronger predictions across 51 datasets {#does-it-hold-up}

We evaluated Ephris on **51 node-classification datasets across six application domains**, comparing it with 15 graph neural networks and six graph foundation models. The tuned neural networks underwent an extensive validation-based search.

The Elo leaderboard summarizes pairwise model comparisons across the benchmark. Ephris leads in both settings: **50% and 10% labeled context**.

![Original Elo leaderboard across 51 datasets. Ephris has the highest aggregate Elo in both label settings; intervals show uncertainty.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-4-elo.svg)

The result extends beyond Elo. Ephris also ranks first on improvability, average rank, and average accuracy in both settings. Its advantage over tuned GNNs is narrower with less labeled context, but the aggregate lead remains.

### Predictive performance and runtime together

Does that performance require more computation? The next plot pairs adaptation time with *improvability*, the normalized performance gap to the best model. **Lower is better on both axes.**

![Original improvability–runtime Pareto comparison under 50% and 10% labeled context. Ephris improves the lower-left frontier in both panels.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-5-performance-runtime.png)

Ephris advances the frontier in both label settings. Its adaptation time is much lower than GraphPFN's and remains in the same general range as training a single GNN once.

These plots show that sparse message passing can support strong graph in-context learning at a practical cost. The benchmark compares adaptation to real datasets; a separate experiment tests how that cost grows with graph size.

:::details[Evaluation details]

Train/validation/test proportions were 50/25/25 and 10/10/80, with five splits per setting. Ephris used training labels as context. Supervised baselines used validation labels for model selection and early stopping; each tuned GNN selected from 200 configurations.

Elo summarizes pairwise outcomes across datasets; it is a relative rating, not classification accuracy. Elo, improvability, and average rank use AUROC on binary tasks and accuracy on multiclass tasks. Average accuracy uses accuracy throughout. Elo intervals are 95% confidence intervals; hatched bars include imputed default GCN scores for runs that exhausted memory.

Runtime covers adaptation to each dataset: a single training run for default GNNs, the hyperparameter search for tuned GNNs, and the relevant procedure for foundation models. The comparison excludes initial pretraining. All results shown here are from the paper.

:::

## Scalability {#how-it-scales}

Sparse communication changes how inference grows with the input. Ephris processes feature values and exchanges messages over graph edges, while the number of summary tokens and global nodes stays fixed.

For a graph with **N nodes, F features per node, and E edges**, each prediction pass has complexity **`O(NF + E)`**, with the model dimensions, token counts, and depth fixed. The `NF` term counts feature entries; the `E` term counts graph connections. Dense graphs can have quadratically many edges, so runtime follows the actual input size, including those edges.

To measure scaling directly, we increased synthetic graph size from **50,000 to 500,000 nodes**, keeping feature count, average degree, and labeled fraction fixed:

![Original runtime scaling experiment over graphs with 50,000 to 500,000 nodes. Ephris grows nearly linearly, while NodePFN and GraphPFN grow nearly quadratically.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-3-scaling.png)

Ephris grows nearly linearly over the measured range, while NodePFN and GraphPFN grow nearly quadratically. As the graphs become larger, the runtime gap widens.

This supports the architectural scaling claim under the tested settings. Together with the benchmark, it shows that stronger aggregate predictions and linear scaling can coexist in graph in-context learning.

:::details[Scaling experiment details]

Graphs had 32 features per node, average degree 8, and 50% labeled context. Each point is the median over three seeds on one NVIDIA H200, without ensembling. Timing includes preprocessing and inference, and excludes model loading. The fitted exponent describes growth over this measured range.

:::

## Performance across the subgroups {#where-it-still-struggles}

An aggregate leaderboard can hide differences between datasets. We therefore grouped the benchmark by properties such as graph size, feature count, class count, and how often connected nodes share a label.

![Original subgroup ranking plot. Ephris generally leads the aggregate subgroup comparisons, while tuned GCNII leads the highest-feature and highest-class groups.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-6-subgroups.svg)

Ephris performs strongly across most groups, suggesting that its aggregate lead spans a range of graph characteristics. The clearest exceptions against tuned GCNII are datasets with **at least 5,000 features or more than ten classes**, beyond the ranges directly seen during pretraining.

These exceptions help identify where broader pretraining could matter. The current results establish performance for node classification; extending the approach to other graph tasks remains a further step.

## What comes next? {#spend-the-time-on-the-data}

Ephris combines strong node-classification performance with linear scaling. This opens up two directions we want to explore.

**Beyond node classification.** How can we extend scalable graph in-context learning to edge-level and graph-level tasks? Predicting a connection or classifying an entire graph changes how we represent labeled examples and use them as context.

**Discovering relationships in tables.** In tabular data, relationships between rows are usually not given explicitly. Can we discover useful, sparse connections and use them to guide in-context learning? If those connections can also be constructed efficiently, could this improve the scalability of tabular foundation models while preserving their predictive strength?

### Cite this work

Dooho Lee, Jinmo Lee, Minho Jeong, Kijung Shin, and Jaemin Yoo. (2026). *Message Passing Does More with Less for In-Context Learning on Graphs*. arXiv\:2609.37057.

::links[[Read the paper](https://arxiv.org/abs/2609.37057) [View the code](https://github.com/nums-ai/ephris)]

:::references[References]

1. **TabPFN.** Noah Hollmann, Samuel Müller, Katharina Eggensperger, and Frank Hutter. (2023). *TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second*. ICLR.

2. **NodePFN.** Jeongwhan Choi, Jongwoo Kim, Woosung Kang, and Noseong Park. (2026). *Learning Posterior Predictive Distributions for Node Classification from Synthetic Graph Priors*. ICLR.

3. **GraphPFN.** Dmitry Eremeev, Oleg Platonov, Gleb Bazhenov, Artem Babenko, and Liudmila Prokhorenkova. (2026). *GraphPFN: A Prior-Data Fitted Graph Foundation Model*. ICML.

4. **LimiX.** Xingxuan Zhang et al. (2025). *LimiX: Unleashing Structured-Data Modeling Capability for Generalist Intelligence*. arXiv\:2509.03505.

5. **GCN.** Thomas N. Kipf and Max Welling. (2017). *Semi-Supervised Classification with Graph Convolutional Networks*. ICLR.

6. **GCNII.** Ming Chen, Zhewei Wei, Zengfeng Huang, Bolin Ding, and Yaliang Li. (2020). *Simple and Deep Graph Convolutional Networks*. ICML.

:::
