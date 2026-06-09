# 12 — Binary Search Trees: Fundamentals and Patterns

> Prerequisite: [11 — Trees](../11-trees/11-trees-fundamentals-and-patterns.md) and
> [10 — Searching](../10-searching/10-searching-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/bst`](../../code/src/main/java/dsa/bst) ·
> tests: `cd code && mvn test -Dtest='dsa.bst.*'`

## Overview

A binary search tree (BST) is a binary tree with one extra rule — the **BST invariant**: for every
node, all values in its left subtree are smaller and all values in its right subtree are larger.
That single constraint turns a tree into a searchable structure: at each node you discard half the
remaining tree, exactly like binary search on a sorted array (lesson 10), but with O(log n)
inserts and deletes too.

**You will learn to:**

- Implement BST insert, search, delete, and min using the invariant.
- Understand why operations are O(h) and why **balance** is the whole game.
- Connect this to the JDK's `TreeMap`/`TreeSet`.

---

## Core Concept

### The invariant in a picture

```text
         5            left subtree < 5 < right subtree, recursively
       /   \
      3     8
     / \   / \
    2   4 7   9
```

In-order traversal (Left, Node, Right) of any BST yields **sorted** output: `2 3 4 5 7 8 9`.

### Search / insert: follow the invariant

At each node, compare and go left (smaller) or right (larger):

```java
// dsa.bst.BinarySearchTree#contains
while (node != null) {
    int cmp = value.compareTo(node.value);
    if (cmp == 0) return true;
    node = (cmp < 0) ? node.left : node.right;   // discard half the tree
}
```

```text
Time: O(h)  — O(log n) balanced, O(n) degenerate
```

Insert is the same walk; when you fall off the tree (`null`), that's where the new node attaches.

### Delete: the three cases

Deletion is the tricky operation. Once you find the node:

1. **No children (leaf)** — just remove it.
2. **One child** — replace the node with its single child.
3. **Two children** — replace the node's value with its **in-order successor** (the smallest value
   in the right subtree), then delete that successor (which is itself a case-1/2 node).

```java
// dsa.bst.BinarySearchTree#delete (two-children case)
Node<T> successor = min(node.right);
node.value = successor.value;
node.right = delete(node.right, successor.value);
```

```text
Time: O(h)
```

---

## Complexity Summary

| Operation | Balanced | Degenerate (worst) |
|---|---:|---:|
| search / contains | `O(log n)` | `O(n)` |
| insert | `O(log n)` | `O(n)` |
| delete | `O(log n)` | `O(n)` |
| min / max | `O(log n)` | `O(n)` |
| in-order (sorted dump) | `O(n)` | `O(n)` |

Everything is **O(h)**. The entire value of a BST hinges on `h` staying near `log n`.

---

## For Experienced Devs

**A plain BST degenerates — that's why you never ship one.** Insert `1, 2, 3, 4, 5` in order and
the "tree" becomes a linked list with `h = n` and O(n) operations. Real systems use
**self-balancing** BSTs that rotate to keep height O(log n): red-black trees (the JDK's choice) and
AVL trees. The `BinarySearchTree` in this lesson is unbalanced *on purpose* — it teaches the
invariant and the delete cases without the rotation machinery.

**Use `TreeMap`/`TreeSet` in production.** They're red-black trees giving guaranteed O(log n)
`get`/`put`/`remove` plus the ordered operations a hash map can't: `firstKey`/`lastKey`,
`floorKey`/`ceilingKey`/`higherKey`/`lowerKey`, `headMap`/`tailMap`/`subMap`, and sorted iteration.
Reach for them whenever you need **ordered** keys or **range/nearest** queries.

**BST vs hash map — the real decision.** `HashMap`/`HashSet`: O(1) average, *unordered*. `TreeMap`/
`TreeSet`: O(log n), *ordered*. If you only do exact-key lookups, hash wins. If you need "smallest
key ≥ X", "iterate in order", or "all keys in [a, b)", you need the tree. Don't pay for ordering
you don't use, and don't bolt sorting onto a hash map when a `TreeMap` is right there.

**In-order = sorted is a workhorse fact.** "Validate a BST," "kth smallest element," "find the
in-order successor," and "range sum in a BST" all reduce to a (possibly partial) in-order walk.

---

## Interview & Backend Notes

**Pattern triggers:**

- "validate BST", "kth smallest/largest", "in-order successor" → **in-order traversal**
- "range [low, high] in a BST", "closest value" → **bounded BST walk** / `subMap`
- "insert/delete keeping sorted order with fast lookup" → **balanced BST (`TreeMap`)**
- "first key ≥ / ≤ X", "floor/ceiling" → **`TreeMap` navigation methods**

**Where BSTs (as balanced trees) show up in backend work:**

- **Ordered in-memory indexes**: time-series buckets, event logs keyed by timestamp where you query
  "events between t1 and t2" or "the latest before T."
- **Leaderboards / ranking**: `TreeMap` of score→players for ordered ranges and rank queries.
- **Rate limiting / scheduling**: ordered structures for "next event due" and windowed counts.
- **Databases**: B-trees (a high-fanout balanced search tree) are the on-disk generalization that
  powers SQL indexes — same logarithmic-search idea, tuned for disk pages.

---

## Practice Problems

Add each solution as a method + test under `dsa.bst`.

1. **Search in a BST** (LeetCode 700) and **Insert into a BST** (LeetCode 701).
2. **Validate Binary Search Tree** (LeetCode 98) — in-order must be strictly increasing.
3. **Kth Smallest Element in a BST** (LeetCode 230) — in-order, stop at k.
4. **Delete Node in a BST** (LeetCode 450) — the three delete cases.
5. **Lowest Common Ancestor of a BST** (LeetCode 235) — use the invariant to descend.

---

## Quiz

### Q1

You insert `10, 20, 30, 40, 50` into an unbalanced BST in that order. What's the tree's shape and
the resulting time complexity of `contains`?

### Q2

To delete a node that has two children, what value replaces it, and where does that value come
from?

### Q3

You need fast lookups by key **and** the ability to iterate keys in sorted order and find "the
largest key ≤ K." `HashMap` or `TreeMap`? Why?

---

## Answer Key

### Q1 Answer

It degenerates into a right-leaning **linked list** (each node has only a right child), so height
= n and `contains` becomes **O(n)** — the worst case. This is exactly why production code uses a
self-balancing tree.

### Q2 Answer

The node's value is replaced by its **in-order successor** — the smallest value in its right
subtree (equivalently, the next-larger value). That successor node is then deleted from the right
subtree (it has at most one child, so it's an easy case).

### Q3 Answer

`TreeMap`. It gives O(log n) key lookup *plus* sorted iteration and navigation methods like
`floorKey(K)`. `HashMap` is O(1) for lookups but has no ordering, so it can't do sorted iteration
or floor/ceiling queries.

---

## Next Steps

Next in the roadmap is **Graphs** — the most general structure, where trees are just the special
acyclic case, traversed with the BFS/DFS you already know.

```text
Continue my DSA learning with Graphs in Java with runnable code + tests, and document it in the DSA folder.
```
