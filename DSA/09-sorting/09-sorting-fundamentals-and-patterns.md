# 09 — Sorting: Fundamentals and Patterns

> Prerequisite: [08 — Recursion](../08-recursion/08-recursion-fundamentals-and-patterns.md)
> (merge/quick sort are recursive)
> Runnable code: [`code/src/main/java/dsa/sorting`](../../code/src/main/java/dsa/sorting) ·
> tests: `cd code && mvn test -Dtest='dsa.sorting.*'`

## Overview

Sorting arranges elements in order. You'll almost never hand-write a sort in production — the JDK's
is excellent — but understanding *how* sorts work teaches the most important algorithmic ideas
(divide and conquer, in-place partitioning, stability) and explains the cost of the `sort` calls
you make every day. Sorting is also the enabler for binary search (lesson 10) and many two-pointer
techniques.

**You will learn to:**

- Implement and contrast the O(n²) sorts (bubble, selection, insertion) and the O(n log n) sorts
  (merge, quick).
- Understand **stability**, **in-place**, and best/worst-case behavior.
- Know what the JDK actually uses and why.

---

## Core Concept

### The two tiers

```text
O(n²):       bubble, selection, insertion   — simple, fine for tiny/nearly-sorted input
O(n log n):  merge, quick, heap             — what you use for real data
```

There's a proven lower bound: any **comparison-based** sort needs Ω(n log n) comparisons in the
worst case. You can only beat that by not comparing (counting/radix sort, for integer keys in a
bounded range).

### Three properties to track

- **In-place** — uses O(1) (or O(log n)) extra space, sorting within the array.
- **Stable** — equal elements keep their original relative order (matters when sorting by one
  field and wanting ties to preserve a prior order).
- **Adaptive** — runs faster on already-/nearly-sorted input.

---

## The O(n²) Sorts

All three sort in place; see [`QuadraticSorts`](../../code/src/main/java/dsa/sorting/QuadraticSorts.java).

- **Bubble** — swap adjacent out-of-order pairs; largest "bubbles" to the end each pass.
  Best case O(n) (early-exit when a pass makes no swaps). Stable.
- **Selection** — each pass picks the min of the unsorted suffix and swaps it into place.
  Always O(n²), even if sorted. Not stable. Minimizes the number of swaps.
- **Insertion** — grow a sorted prefix by inserting each next element. Best case O(n).
  Stable, and **excellent on small or nearly-sorted arrays** — which is why real sorts switch to
  it for small subarrays.

```java
// dsa.sorting.QuadraticSorts#insertionSort
for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; } // shift right
    arr[j + 1] = key;
}
```

---

## Pattern: Divide and Conquer — Merge Sort

Split in half, sort each half recursively, **merge** the two sorted halves with two pointers.

```java
// dsa.sorting.MergeSort#merge (core step)
for (int k = left; k <= right; k++) {
    if (i > mid)            arr[k] = temp[j++];
    else if (j > right)     arr[k] = temp[i++];
    else if (temp[i] <= temp[j]) arr[k] = temp[i++]; // <= preserves stability
    else                    arr[k] = temp[j++];
}
```

```text
Time: O(n log n) guaranteed   Space: O(n)   Stable
```

Guaranteed O(n log n) and stable, at the cost of O(n) extra space — which is exactly why Java uses
a merge variant (TimSort) for object arrays where stability matters.

---

## Pattern: In-Place Partitioning — Quick Sort

Pick a pivot, **partition** so smaller elements go left and larger go right (pivot lands in its
final spot), then recurse on each side.

```java
// dsa.sorting.QuickSort#partition (Lomuto, randomized pivot)
int randomPivot = low + RANDOM.nextInt(high - low + 1);
swap(arr, randomPivot, high);
int pivot = arr[high], i = low;
for (int j = low; j < high; j++) if (arr[j] < pivot) swap(arr, i++, j);
swap(arr, i, high);
return i;
```

```text
Time: O(n log n) average, O(n²) worst   Space: O(log n)   Not stable
```

The randomized pivot avoids the O(n²) trap on already-sorted input. Quick sort is typically the
fastest in practice (great cache behavior, in place), which is why Java uses a dual-pivot quicksort
for primitive arrays.

---

## Complexity Summary

| Sort | Best | Average | Worst | Space | Stable |
|---|---:|---:|---:|---:|:--:|
| Bubble | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | yes |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | no |
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | yes |
| Merge | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | yes |
| Quick | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` | no |

---

## For Experienced Devs

**What the JDK actually does.** `Arrays.sort(int[])` (primitives) uses a **dual-pivot quicksort**
(fast, in place, instability doesn't matter for primitives). `Arrays.sort(Object[])` and
`Collections.sort` / `List.sort` use **TimSort** — a stable, adaptive merge/insertion hybrid that
exploits existing runs and is O(n) on already-sorted data. Both fall back to insertion sort for
small subarrays. So: primitives → unstable but fast; objects → stable.

**Stability matters in practice.** Sort orders by `lastName`, then by `firstName` — a stable sort
lets you sort by the secondary key first, then the primary, and ties keep the earlier order. With
`Comparator`, prefer `comparing(...).thenComparing(...)` over chained unstable sorts.

**Don't write your own.** In real code use `Arrays.sort` / `List.sort` / `stream().sorted(...)`
with a `Comparator`. Beware the legacy contract pitfall: a `Comparator` that isn't consistent
(violates transitivity) throws `IllegalArgumentException: Comparison method violates its general
contract!` from TimSort.

**Sorting cost vs. need.** If you only need the top-k or a min/max, a heap (`PriorityQueue`,
O(n log k)) or quickselect (O(n) average) beats a full O(n log n) sort. Don't sort when you don't
have to.

---

## Interview & Backend Notes

**Pattern triggers:**

- "sort then …", "kth largest/smallest", "merge sorted lists/intervals" → sorting / heap
- "find pairs/triples summing to X" → sort + two pointers (lesson 02)
- "top k", "running median" → heap, not a full sort
- "count smaller to the right", "inversions" → merge sort variant

**Where sorting shows up in backend/Spring work:**

- **Ordering query results**: usually push `ORDER BY` to the database; sort in app code only for
  in-memory/derived data.
- **`Comparator` everywhere**: sorting DTOs for API responses, paginated lists, reports.
- **Deterministic output**: sorting before serializing for stable diffs, ETags, idempotent files.
- **Merging streams**: combining pre-sorted sources (k-way merge) in ETL/log pipelines.

---

## Practice Problems

Add each solution as a method + test under `dsa.sorting`.

1. **Sort an Array** (LeetCode 912) — implement merge or quick sort.
2. **Merge Intervals** (LeetCode 56) — sort by start, then sweep.
3. **Kth Largest Element** (LeetCode 215) — heap or quickselect (don't fully sort).
4. **Sort Colors** (LeetCode 75) — Dutch national flag, a partition variant.
5. **Largest Number** (LeetCode 179) — custom `Comparator`.

---

## Quiz

### Q1

You need to sort a list of `Order` objects by amount, and orders with equal amounts must keep
their original arrival order. Which property must the sort have, and does `Collections.sort` provide
it?

### Q2

Why does the quick sort in this lesson choose a **random** pivot instead of always using the last
element?

### Q3

For an already-sorted array of 1,000,000 integers, which is faster in this lesson's code: bubble
sort or selection sort? Why?

---

## Answer Key

### Q1 Answer

It must be **stable**. `Collections.sort` / `List.sort` use TimSort, which is stable — so equal
amounts preserve their original order.

### Q2 Answer

A fixed last-element pivot degrades to O(n²) on already-sorted (or reverse-sorted) input, because
every partition is maximally unbalanced. A random pivot makes that worst case astronomically
unlikely, keeping the expected time O(n log n).

### Q3 Answer

**Bubble sort.** It early-exits after the first pass when no swaps occur → O(n) on sorted input.
Selection sort always scans the full unsorted suffix every pass → O(n²) regardless of input order.

---

## Next Steps

Next in the roadmap is **Searching** — where keeping data sorted pays off with O(log n) binary
search.

```text
Continue my DSA learning with Searching algorithms in Java with runnable code + tests, and document it in the DSA folder.
```
