---
slug: ephris-a-new-graph-without-a-new-training-run
status: published
date: '2026-09-30'
author: Dooho Lee
readingMinutes: 7
title: 'Ephris: Stronger In-Context Learning on Graphs with Linear Scaling'
category: Research
summary: >-
  Ephris ranks first overall across 51 node-classification datasets. Sparse
  message passing keeps computation linear in feature entries and edges.
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
      Figure 3. Runtime as graph size increases from 50,000 to 500,000 nodes.
      β near 1 indicates linear growth.
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
      Farther out is better; N is the number of datasets in each group.
  paper-figure-5-performance-runtime.png:
    width: 2400
    height: 1040
    minWidth: 640
    caption: >-
      Figure 5. Lower is better on both axes. Ephris advances the
      performance–runtime frontier in both label settings.
---
**A graph already tells us how its nodes are connected. Can a pretrained model use those connections to learn from labeled examples at scale?**

Ephris is our answer. It uses sparse message passing to predict unknown node labels from a graph and its labeled examples, without updating its pretrained weights.

Across 51 node-classification datasets, Ephris ranks first overall among the models we evaluated. The plot above shows its performance alongside adaptation time. Its computation also scales linearly in feature entries and edges.

## What is graph in-context learning? {#show-it-the-task}

A tabular foundation model uses labeled rows in a new table to predict labels for the remaining rows. Those labeled rows form the *context*: examples from which the model infers the task, without retraining.

**Graph in-context learning extends this idea to connected data.** Nodes play the role of rows, with features describing each node and edges connecting them. Known node labels provide the context.

For example, suppose we want to predict the topics of research papers. Given topic labels for some papers, the model predicts topics for the rest using:

- **Node features:** numerical descriptions of each paper.
- **Edges:** citations connecting the papers.
- **Context labels:** the known topics of some papers.

The model sees features and connections for every node. The labels it is asked to predict stay hidden.

NodePFN and GraphPFN build on tabular foundation models. NodePFN adds a message-passing branch to TabPFN, and GraphPFN adds graph-attention adapters to LimiX. Both incorporate graph structure while retaining dense attention over context nodes.

## Does a graph need attention between every pair? {#use-the-connections}

Dense attention lets a tabular model compare rows and learn relationships between them. But the number of pairwise comparisons grows quadratically with the context size. If the labeled fraction stays fixed, doubling the graph size means roughly four times as many context pairs.

A graph already provides **connections through which nodes can share information.** In our paper example, a citation connects papers that may have related topics.

We built Ephris around sparse message passing to use those connections for in-context learning. The model learns how to use information from graph neighborhoods, avoiding dense attention across all node pairs.

## How Ephris uses the graph {#inside-ephris}

In Ephris, each node combines its own features with information from its neighbors. Known labels provide the context for predicting unknown ones.

Graph structure also shapes how the model processes features:

![Original Ephris architecture diagram: feature tokenization, graph-aware refinement, compression, message passing with global nodes, and label prediction.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-2-architecture.png)

1. **Encode features and known labels.** Each feature value becomes a learned token; known labels receive their own embeddings.
2. **Refine features using the dataset and graph.** Summary tokens capture feature distributions. Node summaries exchange information over graph edges and feed it back into the feature tokens.
3. **Compress each node.** The refined features are combined into a fixed-size representation, so the model can work with different numbers of features.
4. **Predict missing labels.** Message-passing blocks combine features, connections, and labeled examples. A shared prediction head outputs class probabilities for the unlabeled nodes.

Graph structure guides both feature compression and label prediction.

:::details[A few model details]

The evaluated model has 50.16 million parameters. It uses three feature-refinement blocks, compresses each node to 512 dimensions, and applies ten message-passing blocks. Each message-passing block includes eight global nodes.

The prediction head handles up to ten classes directly. For tasks with more classes, a fixed coding scheme divides the task into smaller classification problems and combines their probabilities, using the same pretrained weights.

:::

## Learning from synthetic graph tasks {#practice-before-the-real-graph}

We pretrained Ephris on **3.84 million synthetic graph tasks** to teach it how to use labeled examples. No real benchmark datasets were used in pretraining.

The generator varies the graph structure and the relationships among features and labels. Graphs can contain communities, hubs, or paths. Tasks also vary how information spreads through the graph, from gradual propagation to cascades and effects that depend on how nodes are connected.

In each task, the model sees some labels and predicts the rest. Across millions of these tasks, it learns to infer a prediction rule from a new set of examples.

## Stronger predictions across 51 datasets {#does-it-hold-up}

We evaluated Ephris on **51 node-classification datasets across six application domains**, comparing it with 15 graph neural networks (GNNs) and six graph foundation models. The tuned GNNs used an extensive hyperparameter search on validation data.

Elo summarizes pairwise model comparisons across datasets. Ephris has the highest Elo with both **50% and 10% labeled context**.

![Original Elo leaderboard across 51 datasets. Ephris has the highest aggregate Elo in both label settings; intervals show uncertainty.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-4-elo.svg)

Ephris also ranks first on improvability, average rank, and average accuracy in both settings. Its lead over tuned GNNs narrows with less labeled context, but it remains ahead overall.

### Performance and runtime

The next plot compares the time needed to apply each model to a new dataset with *improvability*, the normalized performance gap to the best model. **Lower is better on both axes.** Initial pretraining is excluded.

![Original improvability–runtime Pareto comparison under 50% and 10% labeled context. Ephris improves the lower-left frontier in both panels.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-5-performance-runtime.png)

Ephris improves the trade-off in both label settings. Its adaptation time is much lower than GraphPFN's and in the same general range as training a single GNN once.

:::details[Evaluation details]

We used train/validation/test proportions of 50/25/25 and 10/10/80, with five splits per setting. Ephris used training labels as context. Supervised baselines used validation labels for model selection and early stopping; each tuned GNN selected from 200 configurations.

Elo is a relative rating based on pairwise outcomes across datasets. Elo, improvability, and average rank use AUROC on binary tasks and accuracy on multiclass tasks. Average accuracy uses accuracy throughout. Elo intervals are 95% confidence intervals; hatched bars include imputed default GCN scores for runs that exhausted memory.

Runtime covers adaptation to each dataset: a single training run for default GNNs, the hyperparameter search for tuned GNNs, and each foundation model's adaptation procedure. It excludes initial pretraining.

:::

## Scalability {#how-it-scales}

Ephris processes feature entries and passes messages along edges, with a fixed number of summary tokens and global nodes.

For a graph with **N nodes, F features per node, and E edges**, a prediction pass costs **`O(NF + E)`** when model dimensions, token counts, and depth are fixed. Here, `NF` counts feature entries and `E` counts edges. The cost is linear in the input size; a dense graph can still have quadratically many edges.

To measure scaling directly, we increased synthetic graph size from **50,000 to 500,000 nodes**, keeping feature count, average degree, and labeled fraction fixed:

![Original runtime scaling experiment over graphs with 50,000 to 500,000 nodes. Ephris grows nearly linearly, while NodePFN and GraphPFN grow nearly quadratically.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-3-scaling.png)

Ephris grows nearly linearly over the measured range, while NodePFN and GraphPFN grow nearly quadratically. The runtime gap widens as the graphs grow.

:::details[Scaling experiment details]

Graphs had 32 features per node, average degree 8, and 50% labeled context. Each point is the median over three seeds on a single NVIDIA H200, without ensembling. Timing includes preprocessing and inference but excludes model loading. The fitted exponent describes growth over the measured range.

:::

## Performance across different graphs {#where-it-still-struggles}

To see how performance varies between datasets, we grouped them by graph size, feature count, class count, and how often connected nodes share a label.

![Original subgroup ranking plot. Ephris generally leads the aggregate subgroup comparisons, while tuned GCNII leads the highest-feature and highest-class groups.](/blog/ephris-a-new-graph-without-a-new-training-run/paper-figure-6-subgroups.svg)

Ephris performs well across most groups. Tuned GCNII has the advantage in the groups with **at least 5,000 features or more than ten classes**, both outside the ranges seen during pretraining.

These gaps suggest where broader pretraining could help.

## What comes next? {#spend-the-time-on-the-data}

We want to build on these results in two directions.

**Beyond node classification.** How can we extend scalable graph in-context learning to edge-level and graph-level tasks? Predicting a connection or classifying an entire graph changes how we represent labeled examples and use them as context.

**Discovering relationships in tables.** In tabular data, we usually don't have an explicit graph. Can we discover useful, sparse connections between rows and use them for in-context learning? If we can build those connections efficiently, could they make tabular foundation models more scalable while preserving predictive performance?

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
