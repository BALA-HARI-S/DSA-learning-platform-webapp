# 08 — Recursion: Fundamentals and Patterns

> Prerequisite: [05 — Stack](../05-stack/05-stack-fundamentals-and-patterns.md) (recursion uses
> the call stack)
> Runnable code: [`code/src/main/java/dsa/recursion`](../../code/src/main/java/dsa/recursion) ·
> tests: `cd code && mvn test -Dtest='dsa.recursion.*'`

## Overview

Recursion is when a method solves a problem by calling itself on a smaller version of the same
problem. It's not a data structure — it's a *technique*, and it's the foundation for tree/graph
traversal (lessons 11, 13), divide-and-conquer sorting (lesson 09), and dynamic programming
(lesson 14).

Every recursive method needs exactly two parts:

1. a **base case** that returns without recursing (stops the chain), and
2. a **recursive case** that calls itself on input closer to the base case (makes progress).

Miss the base case or fail to shrink the input, and you get infinite recursion → `StackOverflowError`.

**You will learn to:**

- Write correct recursion (base case + progress) and reason about its cost.
- See why naïve branching recursion explodes, and fix it with **memoization**.
- Apply **backtracking** to generate combinations/subsets.

---

## Core Concept

### Anatomy of a recursive method

```java
// dsa.recursion.RecursionBasics#factorial
public static long factorial(int n) {
    if (n <= 1) return 1;            // base case
    return n * factorial(n - 1);     // recursive case (n shrinks toward base)
}
```

### Recursion is a stack

Each call pushes a frame onto the call stack and pauses until its sub-call returns. `factorial(4)`
unwinds like this:

```text
factorial(4) = 4 * factorial(3)
                   = 3 * factorial(2)
                           = 2 * factorial(1)
                                   = 1            <- base case
```

So recursion depth `d` costs **O(d) stack space** even when no array is allocated. Deep recursion
on large inputs can overflow the stack — see the experienced notes.

### Cost depends on the branching

| Shape | Example | Time |
|---|---|---:|
| Reduce by 1, one call | factorial, sumTo | `O(n)` |
| Halve each step | fast power, binary search | `O(log n)` |
| Two calls per step (no caching) | naïve Fibonacci | `O(2^n)` |
| Two calls per step (cached) | memoized Fibonacci | `O(n)` |

---

## Pattern 1: Divide the Exponent — Fast Power

Halving the exponent instead of decrementing turns O(n) into O(log n):

```java
// dsa.recursion.RecursionBasics#power
public static long power(long base, int exp) {
    if (exp == 0) return 1;
    long half = power(base, exp / 2);
    return (exp % 2 == 0) ? half * half : base * half * half;
}
```

```text
Time: O(log exp)   Space: O(log exp)
```

---

## Pattern 2: The Memoization Fix — Fibonacci

Naïve Fibonacci recomputes the same subproblems an exponential number of times:

```java
// dsa.recursion.Fibonacci#naive — O(2^n), do NOT use for large n
public static long naive(int n) {
    if (n <= 1) return n;
    return naive(n - 1) + naive(n - 2);
}
```

**Memoization** caches each computed result so every subproblem is solved once — collapsing
O(2^n) to O(n). This is the bridge to dynamic programming (lesson 14).

```java
// dsa.recursion.Fibonacci#memoized
private static long memoized(int n, Map<Integer, Long> cache) {
    if (n <= 1) return n;
    Long cached = cache.get(n);
    if (cached != null) return cached;
    long result = memoized(n - 1, cache) + memoized(n - 2, cache);
    cache.put(n, result);
    return result;
}
```

```text
naive:    Time O(2^n)
memoized: Time O(n)   Space O(n)
```

---

## Pattern 3: Backtracking — Generate Subsets

Backtracking = recursion that builds a candidate, explores deeper, then **undoes** the last choice
to try the next. The template "choose → explore → un-choose" generates all subsets, permutations,
and combinations.

```java
// dsa.recursion.Subsets#backtrack
result.add(new ArrayList<>(current));          // every node is a valid subset
for (int i = start; i < nums.length; i++) {
    current.add(nums[i]);                       // choose
    backtrack(nums, i + 1, current, result);    // explore
    current.remove(current.size() - 1);         // un-choose (backtrack)
}
```

```text
Time: O(n · 2^n)  (2^n subsets, each up to length n)   Space: O(n) recursion depth
```

---

## Complexity Summary

| Algorithm | Time | Space |
|---|---:|---:|
| factorial / sumTo | `O(n)` | `O(n)` stack |
| fast power | `O(log n)` | `O(log n)` stack |
| naïve Fibonacci | `O(2^n)` | `O(n)` stack |
| memoized Fibonacci | `O(n)` | `O(n)` |
| subsets (backtracking) | `O(n · 2^n)` | `O(n)` stack |

---

## For Experienced Devs

**`StackOverflowError` is real.** The JVM default thread stack is ~512KB–1MB — roughly 10k–20k
frames. Recursion proportional to input size (e.g. traversing a 100k-node linked list or a
degenerate tree) **will** overflow. Fixes: convert to iteration with an explicit `Deque` (the
stack you saw in lesson 05), increase stack size with `-Xss`, or restructure the algorithm.

**Java has no tail-call optimization.** Even a tail-recursive method keeps a frame per call — the
compiler does *not* turn it into a loop the way some functional languages do. So you can't rely on
TCO to make deep recursion safe in Java; rewrite hot/deep recursion iteratively.

**Memoization vs tabulation.** Memoization is *top-down* (recurse + cache). Tabulation is
*bottom-up* (fill a table iteratively, no recursion) — it avoids stack-depth limits and often has
less overhead. Lesson 14 builds on this distinction. For caching across calls, `computeIfAbsent`
on a map is the idiomatic one-liner.

**Watch for accidental exponential blowup.** Any "try both branches" recursion without caching
(naïve Fibonacci, naïve recursive subset-sum) is exponential. Spotting overlapping subproblems and
adding a cache is the single highest-leverage optimization in interview DP.

---

## Interview & Backend Notes

**Pattern triggers:**

- "generate all / every combination / permutation / subset", "n-queens", "word search" → **backtracking**
- "the problem is defined in terms of smaller instances of itself" → **recursion**
- "overlapping subproblems", "count ways", "min/max over choices" → **memoize → DP** (lesson 14)
- "divide in half and combine" → **divide and conquer** (lesson 09)

**Where recursion shows up in backend work:**

- **Tree-shaped data**: walking JSON/XML/DOM, category trees, org charts, file systems.
- **Composite/visitor patterns**: recursively processing nested domain objects.
- **Parsing**: recursive-descent parsers for expression languages (e.g. SpEL).
- **Pitfall in practice**: deep recursion over user-supplied nested data is a `StackOverflowError`
  DoS risk — bound the depth or go iterative.

---

## Practice Problems

Add each solution as a method + test under `dsa.recursion`.

1. **Fibonacci Number** (LeetCode 509) — naïve vs memoized; measure the difference.
2. **Pow(x, n)** (LeetCode 50) — fast exponentiation (mind negative exponents).
3. **Subsets** (LeetCode 78) and **Permutations** (LeetCode 46) — backtracking.
4. **Reverse a Linked List** recursively (revisit lesson 04 iteratively vs recursively).
5. **Tower of Hanoi** — classic recursion with O(2^n) moves.

---

## Quiz

### Q1

What are the two mandatory parts of any correct recursive method, and what happens if the second
one doesn't move toward the first?

### Q2

`Fibonacci.naive(50)` is effectively uncomputable in reasonable time, but `Fibonacci.memoized(50)`
is instant. Why? Give the two time complexities.

### Q3

A recursive method walks a singly linked list of 1,000,000 nodes. What's the risk, and how do you
fix it?

---

## Answer Key

### Q1 Answer

A **base case** (returns without recursing) and a **recursive case** (calls itself on smaller
input). If the recursive case doesn't shrink the input toward the base case, the recursion never
terminates → infinite recursion → `StackOverflowError`.

### Q2 Answer

Naïve Fibonacci recomputes overlapping subproblems exponentially → **O(2^n)**. Memoization caches
each `F(n)` so each is computed once → **O(n)** time (O(n) space for the cache + stack).

### Q3 Answer

It risks `StackOverflowError` — depth is proportional to the 1,000,000-node length, exceeding the
JVM's default stack. Fix it by rewriting the traversal iteratively with a loop (or an explicit
`Deque`), since Java has no tail-call optimization.

---

## Next Steps

Next in the roadmap is **Sorting** — including the divide-and-conquer sorts (merge, quick) that put
recursion to work.

```text
Continue my DSA learning with Sorting algorithms in Java with runnable code + tests, and document it in the DSA folder.
```
