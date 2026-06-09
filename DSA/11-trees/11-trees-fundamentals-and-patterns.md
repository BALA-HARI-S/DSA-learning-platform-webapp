# 11 — Trees: Fundamentals and Patterns

> Prerequisite: [08 — Recursion](../08-recursion/08-recursion-fundamentals-and-patterns.md) and
> [06 — Queue](../06-queue/06-queue-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/trees`](../../code/src/main/java/dsa/trees) ·
> tests: `cd code && mvn test -Dtest='dsa.trees.*'`

## Overview

A tree is a hierarchical structure of **nodes** connected by edges, with one **root** at the top
and no cycles. Each node has children; nodes with no children are **leaves**. A **binary tree**
restricts each node to at most two children (left and right) — the form behind expression trees,
heaps, tries, and the binary search trees of the next lesson.

Trees are defined recursively (a tree is a node whose children are trees), which is why nearly
every tree algorithm is a few lines of recursion.

**You will learn to:**

- Model a binary tree and the vocabulary (root, leaf, height, depth, subtree).
- Traverse a tree four ways: pre-, in-, post-order (DFS) and level-order (BFS).
- Compute structural facts (height, size) recursively.

---

## Core Concept

### The node and the recursive shape

```java
// dsa.trees.TreeNode
public class TreeNode<T> {
    public T value;
    public TreeNode<T> left;
    public TreeNode<T> right;
}
```

```text
          4          depth 0  (root)
        /   \
       2     6        depth 1
      / \   / \
     1   3 5   7      depth 2  (leaves)
```

- **height** = edges on the longest root→leaf path (this tree: 2; empty tree: -1)
- **size** = number of nodes (7)

### Depth-first traversals (recursion / call stack)

Pre/in/post-order differ only in *when* you record the node relative to its children:

| Traversal | Order | Output on the tree above | Typical use |
|---|---|---|---|
| Pre-order | Node, Left, Right | 4 2 1 3 6 5 7 | copy/serialize a tree |
| In-order | Left, Node, Right | 1 2 3 4 5 6 7 | **sorted order for a BST** |
| Post-order | Left, Right, Node | 1 3 2 5 7 6 4 | delete/free, evaluate expression |

```java
// dsa.trees.BinaryTreeTraversals#inorder
inorder(node.left, out);
out.add(node.value);
inorder(node.right, out);
```

### Breadth-first traversal (queue)

Level-order visits the tree level by level using a **queue** — this is BFS, the same engine you'll
reuse on graphs (lesson 13).

```java
// dsa.trees.BinaryTreeTraversals#levelOrder
queue.offer(root);
while (!queue.isEmpty()) {
    TreeNode<T> node = queue.poll();
    result.add(node.value);
    if (node.left != null)  queue.offer(node.left);
    if (node.right != null) queue.offer(node.right);
}
```

Output on the tree above: `4 2 6 1 3 5 7`.

---

## Complexity Summary

| Operation | Time | Space |
|---|---:|---:|
| Any traversal (pre/in/post/level) | `O(n)` | `O(h)` DFS stack / `O(w)` BFS queue |
| height / size | `O(n)` | `O(h)` |
| Search in a general binary tree | `O(n)` | `O(h)` |

`h` = height, `w` = max level width. For a balanced tree `h ≈ log n`; for a degenerate
(list-like) tree `h ≈ n`.

---

## For Experienced Devs

**DFS recursion can overflow the stack.** Traversal depth equals tree height. A balanced tree is
fine (`h ≈ log n`), but a skewed/degenerate tree of `n` nodes recurses `n` deep — convert to an
iterative traversal with an explicit `Deque` for untrusted/large inputs (lesson 08's warning
applies directly).

**Pick the traversal for the job.** In-order on a BST yields sorted output (lesson 12). Post-order
is the one for "compute something about children before the parent" — freeing nodes, evaluating an
expression tree, or bottom-up DP on trees (e.g. subtree sums, height-balance checks). Pre-order
mirrors how you'd serialize/reconstruct a tree.

**Trees in the JDK and the wild.** `TreeMap`/`TreeSet` are red-black trees (self-balancing BSTs,
lesson 12). Heaps (`PriorityQueue`) are complete binary trees stored in an array — index `i`'s
children are `2i+1`, `2i+2`, so no node objects at all. Tries (prefix trees) power autocomplete
and routing. Real-world data is often tree-shaped: JSON/XML/DOM, file systems, org charts,
category hierarchies.

**Balance is everything.** Most tree guarantees (search, insert in O(log n)) assume the tree stays
balanced. Without rebalancing, ordered inserts produce a linked list. That's the entire motivation
for AVL/red-black trees.

---

## Interview & Backend Notes

**Pattern triggers:**

- "traverse / print / collect nodes", "in given order" → **DFS traversal** (pick pre/in/post)
- "level by level", "by depth", "shortest path in a tree", "right side view" → **BFS / level-order**
- "compute a value depending on subtrees" (height, diameter, max path sum, balanced?) → **post-order DFS**
- "validate / search in a BST", "kth smallest" → **in-order** (lesson 12)
- "lowest common ancestor", "path to a node" → DFS with return values / parent tracking

**Where trees show up in backend work:**

- **Hierarchical data**: rendering category trees, comment threads, org charts, BOMs.
- **Parsing**: ASTs/expression trees for query/rule languages; XML/JSON DOM walking.
- **Indexes**: database B-trees and `TreeMap`-backed in-memory ordered indexes.
- **Routing & dispatch**: trie/tree-structured URL routers and decision trees.

---

## Practice Problems

Add each solution as a method + test under `dsa.trees`.

1. **Maximum Depth of Binary Tree** (LeetCode 104) — height via recursion.
2. **Binary Tree Level Order Traversal** (LeetCode 102) — BFS, grouped by level.
3. **Invert Binary Tree** (LeetCode 226) — recursion.
4. **Diameter of Binary Tree** (LeetCode 543) — post-order, return height while tracking the best.
5. **Binary Tree Maximum Path Sum** (LeetCode 124) — post-order with a running max.

---

## Quiz

### Q1

For a **binary search tree**, which traversal produces the values in sorted ascending order?

### Q2

A binary tree has 7 nodes arranged as a perfectly balanced tree. What are its height and the max
queue size during a level-order (BFS) traversal?

### Q3

You must compute each node's subtree size (number of nodes under and including it). Which traversal
order is natural, and why?

---

## Answer Key

### Q1 Answer

**In-order** (Left, Node, Right). The BST invariant means everything in the left subtree is
smaller and everything in the right is larger, so visiting left → node → right yields ascending
order.

### Q2 Answer

Height **2** (edges on the longest root→leaf path). The bottom level has 4 nodes, so the BFS queue
holds up to **4** nodes at once (the widest level).

### Q3 Answer

**Post-order.** Subtree size depends on the children's sizes, so you must compute the children
before the parent — exactly what Left, Right, Node ordering gives you.

---

## Next Steps

Next in the roadmap is **Binary Search Trees** — adding the ordering invariant that makes a tree
searchable.

```text
Continue my DSA learning with Binary Search Trees in Java with runnable code + tests, and document it in the DSA folder.
```
