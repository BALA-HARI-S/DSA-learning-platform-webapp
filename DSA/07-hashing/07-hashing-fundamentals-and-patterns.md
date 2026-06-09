# 07 — Hashing: HashMap, HashSet, and Patterns

> Prerequisite: [02 — Arrays](../02-arrays/02-arrays-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/hashing`](../../code/src/main/java/dsa/hashing) ·
> tests: `cd code && mvn test -Dtest='dsa.hashing.*'`

## Overview

Hashing gives you **average O(1) insert, lookup, and delete** by converting a key into an array
index via a hash function. A `HashMap` stores key→value pairs; a `HashSet` stores just keys (it's
a `HashMap` with dummy values). This single capability — "have I seen this before?" / "what's the
value for this key?" in constant time — is the most powerful everyday tool in your DSA kit.

You've already used hashing implicitly (two-sum in lesson 02, anagrams in lesson 03). This lesson
makes the mechanism explicit and drills the counting/grouping patterns.

**You will learn to:**

- Understand how a hash map works internally (buckets, collisions, load factor, resizing).
- Use frequency-counting and signature-grouping patterns fluently.
- Know the `hashCode`/`equals` contract and the real performance characteristics.

---

## Core Concept

### From key to bucket

A hash map keeps an array of **buckets**. To store a key it computes `hash(key)`, maps that to a
bucket index (`hash mod numBuckets`), and stores the entry there. Lookups repeat the computation
and check that one bucket. When two keys map to the same bucket — a **collision** — the entries
are chained in a list (separate chaining).

```java
// dsa.hashing.SimpleHashMap (built from scratch to show the mechanism)
private int bucketIndex(K key, int numBuckets) {
    int h = (key == null) ? 0 : key.hashCode();
    return Math.floorMod(h, numBuckets);
}
```

### Load factor and resizing

If too many entries pile into too few buckets, chains grow long and lookups drift toward O(n). So
when `entries / buckets` exceeds the **load factor** (0.75 in the JDK), the map doubles its bucket
count and **rehashes** every entry. This keeps chains short and operations averaging O(1).

| Operation | Average | Worst case |
|---|---:|---:|
| put / get / remove / contains | `O(1)` | `O(n)` (all keys collide) |
| iterate all entries | `O(n)` | `O(n)` |

### The everyday API

```java
Map<String, Integer> counts = new HashMap<>();
counts.merge(key, 1, Integer::sum);     // count occurrences in one line
counts.computeIfAbsent(key, k -> new ArrayList<>()).add(v); // group into buckets
Set<Integer> seen = new HashSet<>();
if (!seen.add(x)) { /* x was a duplicate */ }
```

---

## Pattern 1: Frequency Counting

Turn an O(n²) "count how many times each thing appears" into a single O(n) pass.

```java
// dsa.hashing.Frequencies#firstUniqueCharIndex
Map<Character, Integer> counts = new LinkedHashMap<>();
for (int i = 0; i < s.length(); i++) counts.merge(s.charAt(i), 1, Integer::sum);
for (int i = 0; i < s.length(); i++) if (counts.get(s.charAt(i)) == 1) return i;
return -1;
```

```text
Time: O(n)   Space: O(k) distinct keys
```

---

## Pattern 2: Signature Grouping

Group items that share a derived **canonical key**. For anagrams, the sorted characters are
identical for all members of a group, so they collapse under one map key.

```java
// dsa.hashing.GroupAnagrams#group
Map<String, List<String>> groups = new HashMap<>();
for (String word : words) {
    char[] chars = word.toCharArray();
    Arrays.sort(chars);
    groups.computeIfAbsent(new String(chars), k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(groups.values());
```

```text
Time: O(n · k log k)   Space: O(n · k)
```

The same idea powers "group by", deduplication, and indexing: derive a key, bucket by it.

---

## Complexity Summary

| Task | Time | Space | Idea |
|---|---:|---:|---|
| put / get / contains | `O(1)` avg | `O(1)` | hash to a bucket |
| Frequency count | `O(n)` | `O(k)` | map of counts |
| Group by signature | `O(n · cost(key))` | `O(n)` | canonical key |
| Deduplicate | `O(n)` | `O(n)` | `HashSet` |
| Two-sum style lookup | `O(n)` | `O(n)` | "seen" map (lesson 02) |

---

## For Experienced Devs

**The `hashCode`/`equals` contract is mandatory.** If you use an object as a map key: equal
objects **must** have equal hash codes, and `equals` must be consistent. Break this (e.g. override
`equals` but not `hashCode`) and entries vanish — you put with one hash bucket and look up in
another. Always override them together, prefer immutable keys, and let the IDE or `record`
generate them. A `record` gives you correct value-based `equals`/`hashCode` for free — ideal for
composite keys.

**JDK `HashMap` internals (worth knowing).** Default capacity 16, load factor 0.75, capacity always
a power of two (so `index = hash & (capacity-1)`). It applies a supplemental "spread" to mix high
bits. Since Java 8, a bucket that grows past 8 entries **treeifies** into a red-black tree, bounding
worst-case lookups at O(log n) instead of O(n) — but only if keys are `Comparable`.

**Pick the right map.** `HashMap` (unordered, fastest), `LinkedHashMap` (insertion- or
access-order — the latter is a one-line **LRU cache**), `TreeMap` (sorted by key, O(log n), a
red-black tree). `ConcurrentHashMap` for thread-safe access — never a plain `HashMap` shared across
threads (resize during concurrent writes can corrupt it or spin).

**Iteration order.** `HashMap` order is unspecified and can change across versions — never rely on
it. Tests in this lesson compare grouped results as *sets* for exactly this reason.

---

## Interview & Backend Notes

**Pattern triggers:**

- "count occurrences", "frequency", "most common" → **frequency map**
- "have I seen this", "find duplicates", "distinct" → **HashSet**
- "find a pair/complement", "subarray sum equals k" → **"seen" map** (prefix-sum + map)
- "group by", "anagrams", "categorize" → **signature key map**
- "two sum", "first unique" → replace an inner loop with a map lookup

**Where hashing is everywhere in backend/Spring work:**

- **Caching**: Spring's `@Cacheable`, Caffeine/Guava caches, HTTP ETag maps — all hash-based.
- **Dedup & lookup**: de-duplicating records before persisting, in-memory indexes by id.
- **Request/response**: headers, query params, JSON objects are all maps under the hood.
- **Counting/metrics**: tallying events, rate counters, aggregations keyed by dimension.

**Production gotcha:** using a mutable object as a `HashMap` key and then mutating it (changing
its `hashCode`) makes the entry unreachable — a real, hard-to-find bug. Keys should be effectively
immutable.

---

## Practice Problems

Add each solution as a method + test under `dsa.hashing`.

1. **Two Sum** (LeetCode 1) — the canonical "seen" map (revisit from lesson 02).
2. **Group Anagrams** (LeetCode 49).
3. **Top K Frequent Elements** (LeetCode 347) — frequency map + heap/bucket sort.
4. **Subarray Sum Equals K** (LeetCode 560) — prefix-sum counts in a map.
5. **Longest Consecutive Sequence** (LeetCode 128) — `HashSet` for O(1) neighbor checks.

---

## Quiz

### Q1

You override `equals` on a class to compare by `id`, but forget to override `hashCode`. You put
100 of these objects into a `HashSet` and then call `contains` with an equal-by-id object. What
happens?

### Q2

```java
Map<Character,Integer> m = new HashMap<>();
for (char c : "aabbbc".toCharArray()) m.merge(c, 1, Integer::sum);
```

What is `m.get('b')`, and what is the time complexity of building `m`?

### Q3

Why do the `GroupAnagrams` tests compare results as a set of sets rather than asserting exact
list equality?

---

## Answer Key

### Q1 Answer

`contains` almost certainly returns `false`. Without a matching `hashCode`, the lookup computes a
different bucket than the one the object was stored in, so it never finds the equal entry. You
**must** override `hashCode` whenever you override `equals`.

### Q2 Answer

`m.get('b')` is `3`. Building the map is O(n) — one pass over the characters, each `merge` is
average O(1).

### Q3 Answer

`HashMap` iteration order (and therefore the order of groups and of words within a group) is
unspecified and may vary. Comparing as a set of sets makes the assertion order-independent and
robust.

---

## Next Steps

Next in the roadmap is **Recursion** — the technique behind tree/graph traversal, divide-and-conquer
sorting, and dynamic programming.

```text
Continue my DSA learning with Recursion in Java with runnable code + tests, and document it in the DSA folder.
```
