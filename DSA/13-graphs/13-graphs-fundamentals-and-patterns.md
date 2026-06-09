# 13 — Graphs: Fundamentals and Patterns

> Prerequisite: [11 — Trees](../11-trees/11-trees-fundamentals-and-patterns.md),
> [06 — Queue](../06-queue/06-queue-fundamentals-and-patterns.md),
> [07 — Hashing](../07-hashing/07-hashing-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/graphs`](../../code/src/main/java/dsa/graphs) ·
> tests: `cd code && mvn test -Dtest='dsa.graphs.*'`

## Overview

A graph is a set of **vertices** connected by **edges** — the most general data structure here. A
tree is just a special graph (connected, acyclic, n-1 edges). Graphs model anything with
relationships: networks, maps, dependencies, social connections, state machines.

Edges can be **directed** (one-way) or **undirected** (two-way), and **weighted** or unweighted.
Almost every graph algorithm is built on the two traversals you already met on trees — **BFS** (a
queue) and **DFS** (recursion / a stack) — plus a **visited set** to avoid revisiting nodes in the
presence of cycles.

**You will learn to:**

- Represent a graph (adjacency list) and reason about the memory/perf trade-off vs. a matrix.
- Run BFS and DFS, and use BFS to find shortest paths in unweighted graphs.
- Recognize the common graph problem patterns.

---

## Core Concept

### Representation: adjacency list

Store each vertex's neighbors in a map/list. Memory is O(V + E) — efficient for the sparse graphs
that dominate real problems.

```java
// dsa.graphs.Graph
private final Map<Integer, List<Integer>> adjacency = new HashMap<>();
public void addEdge(int u, int v) {
    adjacency.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
    adjacency.computeIfAbsent(v, k -> new ArrayList<>());
    if (!directed) adjacency.get(v).add(u);   // undirected = both directions
}
```

(The alternative, an **adjacency matrix** `boolean[V][V]`, is O(V²) memory but O(1) edge lookup —
good only for dense graphs.)

### BFS — explore by distance (uses a queue)

BFS visits vertices in order of distance from the start, which is why it finds **shortest paths in
an unweighted graph**.

```java
// dsa.graphs.Graph#bfs
queue.offer(start); visited.add(start);
while (!queue.isEmpty()) {
    int node = queue.poll();
    order.add(node);
    for (int neighbor : neighbors(node))
        if (visited.add(neighbor)) queue.offer(neighbor);  // add() == false if seen
}
```

### DFS — explore deep first (uses recursion / a stack)

```java
// dsa.graphs.Graph#dfs
private void dfs(int node, Set<Integer> visited, List<Integer> order) {
    visited.add(node);
    order.add(node);
    for (int neighbor : neighbors(node))
        if (!visited.contains(neighbor)) dfs(neighbor, visited, order);
}
```

### Shortest path = BFS with distance

```java
// dsa.graphs.Graph#shortestPathLength — returns edge count, or -1 if unreachable
queue.offer(new int[] {start, 0});               // {vertex, distance}
// ... on reaching target: return distance + 1
```

The **visited set is mandatory** — without it, a cycle makes BFS/DFS loop forever (the key
difference from tree traversal, where there are no cycles).

---

## Complexity Summary

| Operation | Time | Space |
|---|---:|---:|
| BFS / DFS traversal | `O(V + E)` | `O(V)` |
| Shortest path (unweighted, BFS) | `O(V + E)` | `O(V)` |
| Adjacency-list memory | — | `O(V + E)` |
| Adjacency-matrix memory | — | `O(V²)` |

`V` = vertices, `E` = edges. BFS/DFS touch each vertex and edge once.

---

## For Experienced Devs

**Choose the representation.** Adjacency list (O(V+E) memory) for sparse graphs — almost always
the right default. Adjacency matrix (O(V²)) only when the graph is dense or you need O(1) "is there
an edge u→v?" lookups. Most real graphs (road networks, dependency graphs, social graphs) are
sparse.

**BFS vs DFS — pick deliberately.** BFS → shortest path / fewest steps in an unweighted graph,
level-by-level processing. DFS → reachability, cycle detection, topological sort, connected
components, path existence. DFS recursion depth can hit `StackOverflowError` on large graphs —
use an explicit stack (lesson 05/08) for deep graphs.

**Weighted shortest paths need more.** BFS only finds shortest paths when every edge has equal
weight. With non-negative weights you need **Dijkstra** (a `PriorityQueue`-driven BFS, O((V+E) log
V)); with negative weights, **Bellman-Ford**. Recognizing "this graph is weighted, BFS won't do" is
a common interview discriminator.

**The classic graph toolkit (worth knowing by name):** topological sort (ordering a DAG of
dependencies — Kahn's algorithm or DFS post-order), union-find / disjoint-set (connectivity,
Kruskal's MST), cycle detection, and connected components. Many "non-graph" problems are graphs in
disguise — grids (each cell a vertex), state machines, course prerequisites, build dependencies.

---

## Interview & Backend Notes

**Pattern triggers:**

- "shortest path / fewest steps", "minimum moves", unweighted → **BFS**
- "can you reach", "all paths", "connected components", "detect a cycle" → **DFS**
- "ordering with dependencies", "build/compile order", "course schedule" → **topological sort (DAG)**
- "grid / maze / islands", "flood fill" → BFS/DFS on an implicit grid graph
- "shortest path with weights/costs" → **Dijkstra** (priority queue)
- "are these connected / merge groups" → **union-find**

**Where graphs show up in backend work:**

- **Dependency resolution**: build tools (Maven/Gradle module graphs), Spring bean dependency
  graphs, task DAGs — all topological sorts, and a cycle means a configuration error.
- **Recommendations / social**: friend-of-friend, reachability, shortest connection.
- **Routing & networks**: service meshes, network topology, map/navigation shortest paths.
- **Workflows / state machines**: order/payment lifecycles modeled as directed graphs.

---

## Practice Problems

Add each solution as a method + test under `dsa.graphs`.

1. **Number of Islands** (LeetCode 200) — BFS/DFS flood fill on a grid.
2. **Course Schedule** (LeetCode 207) — cycle detection / topological sort on a DAG.
3. **Clone Graph** (LeetCode 133) — DFS/BFS with a visited map.
4. **Rotting Oranges** (LeetCode 994) — multi-source BFS (shortest time).
5. **Network Delay Time** (LeetCode 743) — Dijkstra on a weighted graph.

---

## Quiz

### Q1

Why does BFS find the shortest path in an **unweighted** graph, and why does it fail to guarantee
that once edges have different weights?

### Q2

What goes wrong if you run BFS or DFS on a graph with a cycle but forget the visited set?

### Q3

You're modeling module build order where module A depends on B and C. Which graph algorithm
produces a valid build order, and what does a cycle in this graph mean?

---

## Answer Key

### Q1 Answer

BFS expands vertices strictly in increasing order of distance (hop count) from the start, so the
first time it reaches a vertex is via a fewest-edges path. With weighted edges, "fewest edges" no
longer means "lowest total cost" — a 3-edge path can be cheaper than a 1-edge path — so you need
Dijkstra instead.

### Q2 Answer

The traversal loops forever (or revisits exponentially): the cycle keeps re-adding already-seen
vertices to the queue/stack. The visited set is what makes graph traversal terminate.

### Q3 Answer

**Topological sort** on the directed dependency graph produces a valid build order (dependencies
before dependents). A **cycle** means a circular dependency — there is no valid order, which is a
configuration error.

---

## Next Steps

Next — and last in this roadmap — is **Dynamic Programming**, which ties together recursion,
memoization, and optimal-substructure thinking.

```text
Continue my DSA learning with Dynamic Programming in Java with runnable code + tests, and document it in the DSA folder.
```
