# 02 — Arrays: Fundamentals and Patterns

> Prerequisite: [01 — Time and Space Complexity](../01-foundations/01-time-and-space-complexity-java-examples.md)
> Runnable code: [`code/src/main/java/dsa/arrays`](../../code/src/main/java/dsa/arrays) ·
> tests: `cd code && mvn test -Dtest='dsa.arrays.*'`

## Overview

An array is a fixed-size, contiguous block of memory holding elements of the same type.
It is the most fundamental data structure — most others (lists, stacks, queues, heaps,
hash tables) are built on top of arrays internally.

Arrays give you one superpower: **O(1) random access**. Because elements sit back-to-back
in memory, the address of `arr[i]` is just `base + i * elementSize`, a single arithmetic
step. Everything good and bad about arrays flows from that layout.

**You will learn to:**

- Reason about array cost: access, search, insert, delete.
- Know when to reach for a raw array vs `ArrayList`.
- Apply the three workhorse array patterns: **two-pointer**, **sliding window**, **prefix sums**.

---

## Core Concept

### Declaring and accessing

```java
int[] arr = new int[5];     // {0, 0, 0, 0, 0} — primitives default to 0
int[] nums = {3, 1, 4, 1, 5};

int first = nums[0];        // O(1)
int n = nums.length;        // length is a field, not a method — O(1)
```

### The cost table that explains everything

| Operation | Cost | Why |
|---|---:|---|
| Access by index | `O(1)` | direct address arithmetic |
| Update by index | `O(1)` | same |
| Search (unsorted) | `O(n)` | must scan |
| Insert/delete at end (dynamic array) | `O(1)` amortized | usually room; occasionally resize |
| Insert/delete in middle | `O(n)` | must shift everything after it |

The last row is the catch: arrays are fast to *read anywhere* but slow to *rearrange*.
Inserting at the front of an `n`-element array means shifting all `n` elements right.

### Fixed array vs `ArrayList`

A Java array has a fixed length forever. `ArrayList` is a **dynamic array**: it wraps an
array and grows automatically.

```java
int[] fixed = new int[3];           // length locked at 3
List<Integer> dynamic = new ArrayList<>();
dynamic.add(10);                    // grows as needed
```

When `ArrayList` runs out of room it allocates a bigger backing array (in the JDK, ~1.5×
the old capacity) and copies everything over. That copy is O(n), but it happens rarely
enough that appends average out to **amortized O(1)** — see the deep-dive below.

---

## Pattern 1: Two Pointers

Use two indices that move toward each other (or in the same direction) instead of nesting
loops. Turns many `O(n²)` brute-force scans into `O(n)`.

Canonical use: reverse an array in place.

```java
// dsa.arrays.ArrayBasics#reverseInPlace
int left = 0, right = arr.length - 1;
while (left < right) {
    int temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
}
```

```text
Time: O(n)   Space: O(1)   (in place — no new array)
```

---

## Pattern 2: Sliding Window

For problems about a **contiguous** subarray (max sum of `k` elements, longest run, etc.),
maintain a window and update it incrementally instead of recomputing from scratch.

Naive "sum of every window of size k" is `O(n·k)`. Sliding it is `O(n)`:

```java
// dsa.arrays.SlidingWindow#maxSumOfWindow
int windowSum = 0;
for (int i = 0; i < k; i++) windowSum += nums[i];   // first window
int maxSum = windowSum;
for (int right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];     // add new, drop old: O(1)
    maxSum = Math.max(maxSum, windowSum);
}
```

```text
Time: O(n)   Space: O(1)
```

The trick: the work to move the window one step is constant — add the element entering on
the right, subtract the one leaving on the left.

---

## Pattern 3: Prefix Sums

When you must answer **many** "sum between index i and j" queries over fixed data,
precompute a cumulative-sum array once (`O(n)`), then answer each query in `O(1)`.

```java
// dsa.arrays.PrefixSum
prefix[i + 1] = prefix[i] + nums[i];     // build once, O(n)
// sum of nums[from..to] =
long rangeSum = prefix[to + 1] - prefix[from];   // O(1) per query
```

```text
Build: O(n) time / O(n) space   Query: O(1)
```

This is exactly how range/aggregation reporting works when the underlying data doesn't change.

---

## Trading space for time: Two Sum

The pattern that shows up in half of all interviews. Find two indices whose values sum to
a target.

- **Brute force**: check every pair — `O(n²)` time, `O(1)` space.
- **HashMap**: as you scan, ask "have I seen `target - current`?" — `O(n)` time, `O(n)` space.

```java
// dsa.arrays.TwoSum#withHashMap
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) return new int[] {seen.get(complement), i};
    seen.put(nums[i], i);
}
```

This is the single most important idea in array problems: **a hash structure can replace an
inner loop, turning `O(n²)` into `O(n)` at the cost of `O(n)` memory.**

---

## Complexity Summary

| Technique | Time | Space | When to use |
|---|---:|---:|---|
| Direct index access | `O(1)` | `O(1)` | you know the position |
| Linear scan | `O(n)` | `O(1)` | unsorted search / aggregate |
| Two pointers | `O(n)` | `O(1)` | reverse, pair-from-sorted, partition |
| Sliding window | `O(n)` | `O(1)` | contiguous subarray problems |
| Prefix sums | `O(n)` build / `O(1)` query | `O(n)` | many range-sum queries |
| Hashing (two sum) | `O(n)` | `O(n)` | replace an inner lookup loop |

---

## For Experienced Devs

**`ArrayList` internals.** Backed by an `Object[] elementData`. Default capacity is 10 (lazily
allocated on first add). On overflow it grows by `oldCapacity + (oldCapacity >> 1)` (~1.5×) via
`Arrays.copyOf`. Appending `n` elements triggers a geometric series of copies totaling `O(n)`
work, hence **amortized O(1)** per `add`. If you know the final size, `new ArrayList<>(capacity)`
avoids all the intermediate resizes.

**Boxing.** `int[]` stores raw ints contiguously — cache-friendly and no per-element object.
`List<Integer>` stores boxed `Integer` objects (pointers to heap objects). For hot numeric loops
over large data, a primitive array is meaningfully faster and lighter. Reach for `List<Integer>`
when you need the Collections API, not for raw number crunching.

**Copying.** `System.arraycopy` / `Arrays.copyOf` are intrinsified bulk memory copies — far
faster than a hand-written element loop. `arr.clone()` is a shallow copy (fine for primitives;
for object arrays the references are shared).

**Gotchas.** `arr.length` is a field; `String.length()` and `List.size()` are methods — easy to
mix up. Array covariance is a real trap: `Object[] o = new String[1]; o[0] = 1;` compiles but
throws `ArrayStoreException` at runtime. `Arrays.asList(intArray)` on a primitive array gives a
`List` of one element (the array itself), not a list of ints.

---

## Interview & Backend Notes

**Pattern triggers** — phrases that hint at each technique:

- "contiguous subarray / substring", "window of size k" → **sliding window**
- "sorted array", "pair that sums to", "in place" → **two pointers**
- "sum/average between indices", "many queries" → **prefix sums**
- "find a pair/complement", "seen before", "count occurrences" → **HashMap/HashSet**

**Where arrays show up in backend/Spring work:**

- **Batching**: chunking a large `List` into fixed-size batches before a bulk DB insert or an
  external API call (the same windowing idea).
- **Pagination**: offset/limit slicing of a result set — index math over a contiguous range.
- **Dedup before persisting**: a `HashSet` pass to drop duplicates is the two-sum idea applied.
- **Buffers**: `byte[]` for I/O, request/response payloads, file streaming.
- **Aggregation/reporting**: prefix-sum-style cumulative metrics over a fixed dataset.

Rule of thumb for picking a type: default to `ArrayList`; use a primitive array for large numeric
/ byte data or tight performance loops; use a fixed array when the size is genuinely constant.

---

## Practice Problems

Add each solution as a method + test under `dsa.arrays`.

1. **Reverse String** (LeetCode 344) — two pointers on a `char[]`.
2. **Best Time to Buy and Sell Stock** (LeetCode 121) — single pass, track running min.
3. **Maximum Subarray** (LeetCode 53) — Kadane's algorithm, a sliding-window cousin.
4. **Contains Duplicate** (LeetCode 217) — `HashSet`.
5. **Move Zeroes** (LeetCode 283) — two pointers, in place.

---

## Quiz

### Q1

```java
public int sumFirstK(int[] arr, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += arr[i];
    return sum;
}
```

```text
Time: ?   Space: ?
```

### Q2

You call `list.add(0, value)` on an `ArrayList` of size `n`, repeatedly inserting at the
**front** `n` times. Total time complexity?

### Q3

```java
boolean anyPairSumsToZero(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    for (int x : arr) {
        if (seen.contains(-x)) return true;
        seen.add(x);
    }
    return false;
}
```

```text
Time: ?   Space: ?
```

---

## Answer Key

### Q1 Answer

```text
Time: O(k)   Space: O(1)
```

The loop runs `k` times (not `n`); only a couple of variables are used.

### Q2 Answer

```text
O(n²)
```

Each front insert shifts all existing elements right (`O(n)`), done `n` times → `O(n²)`.
This is why `ArrayList` is the wrong structure for front-heavy insertion — prefer `ArrayDeque`.

### Q3 Answer

```text
Time: O(n)   Space: O(n)
```

One scan, average O(1) set operations; the set may hold up to `n` elements.

---

## Next Steps

```text
Continue my DSA learning with Strings and document it in the DSA folder.
```

Next lesson: [03 — Strings](../03-strings/03-strings-fundamentals-and-patterns.md).
