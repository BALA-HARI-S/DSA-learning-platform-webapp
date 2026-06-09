# 10 — Searching: Fundamentals and Patterns

> Prerequisite: [09 — Sorting](../09-sorting/09-sorting-fundamentals-and-patterns.md) (binary
> search needs sorted data)
> Runnable code: [`code/src/main/java/dsa/searching`](../../code/src/main/java/dsa/searching) ·
> tests: `cd code && mvn test -Dtest='dsa.searching.*'`

## Overview

Searching is "is this element here, and where?" The whole lesson is really one big trade-off: on
**unsorted** data the best you can do is a linear O(n) scan; on **sorted** data you can binary
search in O(log n). That gap is the entire payoff for keeping data sorted (lesson 09) or hashed
(lesson 07).

**You will learn to:**

- Know when linear search is unavoidable and when binary search applies.
- Implement binary search correctly, including the off-by-one-prone boundary variants.
- Recognize the broader "binary search on the answer" pattern.

---

## Core Concept

### Linear search — works on anything

```java
// dsa.searching.LinearSearch#indexOf
for (int i = 0; i < arr.length; i++) if (arr[i] == target) return i;
return -1;
```

```text
Time: O(n) worst   Space: O(1)
```

No precondition — this is the only option for unsorted data, and it's also how you search a
linked list (no random access).

### Binary search — the O(log n) payoff

Precondition: **sorted** array. Compare the middle; discard the half that can't contain the target;
repeat on the other half.

```java
// dsa.searching.BinarySearch#search
int low = 0, high = arr.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;   // NOT (low+high)/2 — that can overflow
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
}
return -1;
```

```text
Time: O(log n)   Space: O(1)
```

Halving 1,000,000 elements takes only ~20 steps. That's the difference between scanning a million
rows and 20 comparisons.

### The three correctness traps

1. **Overflow**: use `low + (high - low) / 2`, not `(low + high) / 2`.
2. **Loop bound**: `while (low <= high)` with `high = mid - 1` / `low = mid + 1` terminates;
   getting `<=` vs `<` wrong causes infinite loops or missed elements.
3. **Which match**: plain search returns *any* match. For the *first* or *last* of duplicates you
   must keep searching after a hit (next pattern).

---

## Pattern: Boundary Binary Search (first / last occurrence)

With duplicates, "find the first/last index of target" is the real interview test. On a match,
record the position but keep narrowing toward the boundary instead of returning.

```java
// dsa.searching.BinarySearch#firstOccurrence
if (arr[mid] == target) { result = mid; high = mid - 1; } // keep looking LEFT
// firstOccurrence: high = mid - 1   |   lastOccurrence: low = mid + 1
```

```text
Time: O(log n)   Space: O(1)
```

This generalizes to "lower bound / upper bound" (first index ≥ / > target) — the basis of
`Arrays.binarySearch`'s insertion-point semantics and range counting.

---

## Complexity Summary

| Search | Precondition | Time | Space |
|---|---|---:|---:|
| Linear search | none | `O(n)` | `O(1)` |
| Binary search | sorted | `O(log n)` | `O(1)` |
| First/last occurrence | sorted | `O(log n)` | `O(1)` |
| Hash lookup (lesson 07) | hashable | `O(1)` avg | `O(n)` table |

---

## For Experienced Devs

**Use the JDK, mind the return value.** `Arrays.binarySearch` / `Collections.binarySearch` return
the index if found, or `-(insertionPoint) - 1` if not — a *negative* encoding of where it would go.
That negative result is a feature (it tells you the insertion point), but it bites people who
assume `< 0` just means "absent." The array/list **must** be sorted by the same ordering you search
with, or results are undefined.

**`TreeMap`/`TreeSet` are binary search as a data structure.** `floorKey`, `ceilingKey`,
`higherKey`, `lowerKey`, `headMap`, `tailMap`, `subMap` are all O(log n) boundary searches over a
red-black tree — reach for these instead of hand-rolling binary search when you need ordered
lookups that also support insert/delete (e.g. time-series buckets, rate windows, leaderboards).

**Hash vs. sorted+binary.** For pure membership/lookup, a `HashSet`/`HashMap` is O(1) average and
usually wins. Choose sorted + binary search when you also need **range queries**, **nearest
key**, or **ordered iteration** — things hashing can't give you.

**"Binary search on the answer."** When the answer is monotonic — a predicate that's false up to
some threshold then true after — you can binary search the *value space* even without a sorted
array (e.g. "minimum capacity to ship within D days", "smallest divisor"). Spotting monotonicity
is the senior-level skill here.

---

## Interview & Backend Notes

**Pattern triggers:**

- "sorted array", "find/insert position", "first/last occurrence", "count of X" → **binary search**
- "minimize/maximize a value such that a condition holds" (monotonic) → **binary search on the answer**
- "search in rotated sorted array", "find peak", "sqrt(x)" → binary search variants
- "nearest key", "floor/ceiling", "range" → **TreeMap/TreeSet**

**Where searching shows up in backend/Spring work:**

- **Database indexes are B-trees** — `ORDER BY ... LIMIT`, range scans, and `WHERE key = ?` lookups
  are binary-search-on-disk. Knowing this explains why indexed columns are fast and why an index
  must match your query's sort order.
- **In-memory ordered structures**: `TreeMap` for time-bucketed data, sliding rate windows,
  leaderboards, nearest-timestamp lookups.
- **Lookup choices**: a `HashMap` cache for exact-id lookups vs a `TreeMap` when you need
  "the most recent entry before time T."

---

## Practice Problems

Add each solution as a method + test under `dsa.searching`.

1. **Binary Search** (LeetCode 704).
2. **First and Last Position in Sorted Array** (LeetCode 34) — both boundary searches.
3. **Search Insert Position** (LeetCode 35) — lower bound.
4. **Search in Rotated Sorted Array** (LeetCode 33).
5. **Koko Eating Bananas** (LeetCode 875) — binary search on the answer.

---

## Quiz

### Q1

Why is `int mid = low + (high - low) / 2;` preferred over `int mid = (low + high) / 2;`?

### Q2

`Arrays.binarySearch(a, x)` returns `-4`. What does that tell you about `x` and the array?

### Q3

You need fast membership checks **and** "give me the largest key ≤ K". `HashMap` or `TreeMap`?
Why?

---

## Answer Key

### Q1 Answer

`(low + high)` can overflow `int` when both are large, producing a negative `mid` and a bug.
`low + (high - low) / 2` computes the same midpoint without ever exceeding `int` range.

### Q2 Answer

`x` is **not present**. The result encodes the insertion point as `-(insertionPoint) - 1`, so
`-4` means `x` would be inserted at index `3` to keep the array sorted.

### Q3 Answer

`TreeMap`. `HashMap` gives O(1) membership but has no ordering, so it can't answer "largest key ≤
K." `TreeMap` (a red-black tree) supports `floorKey(K)` and friends in O(log n) while still
offering fast key lookup.

---

## Next Steps

Next in the roadmap is **Trees** — hierarchical structures and the traversals (DFS/BFS) that walk
them.

```text
Continue my DSA learning with Trees in Java with runnable code + tests, and document it in the DSA folder.
```
