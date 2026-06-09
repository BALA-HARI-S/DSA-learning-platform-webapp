# 14 — Dynamic Programming: Fundamentals and Patterns

> Prerequisite: [08 — Recursion](../08-recursion/08-recursion-fundamentals-and-patterns.md)
> (memoization is where DP starts)
> Runnable code: [`code/src/main/java/dsa/dp`](../../code/src/main/java/dsa/dp) ·
> tests: `cd code && mvn test -Dtest='dsa.dp.*'`

## Overview

Dynamic programming (DP) solves a problem by breaking it into overlapping subproblems and solving
each subproblem **once**, reusing the result. It applies when a problem has both:

1. **Optimal substructure** — the optimal answer is built from optimal answers to subproblems, and
2. **Overlapping subproblems** — the same subproblems recur many times (so caching pays off).

You already saw the seed of this in lesson 08: naïve Fibonacci is O(2^n), but caching results
(**memoization**) makes it O(n). DP is that idea, applied systematically. It's the topic people
find hardest — not because the code is long, but because the skill is *defining the state and
recurrence*. Get those right and the code is short.

**You will learn to:**

- Tell top-down (memoization) from bottom-up (tabulation) and when to use each.
- Define a DP **state** and **recurrence** for three canonical problems.
- Recognize the problem shapes that signal "this is DP."

---

## Core Concept

### The two styles

| Style | How | Pros | Cons |
|---|---|---|---|
| **Top-down** (memoization) | recurse + cache results | mirrors the natural recursion; only computes needed states | recursion depth / stack risk |
| **Bottom-up** (tabulation) | fill a table from base cases up | no recursion overhead, no stack limit | must compute in dependency order |

Both have the same time complexity; they differ in mechanics. Lesson 08's `Fibonacci.memoized` is
top-down; everything in this lesson is bottom-up.

### The recipe

1. **Define the state**: what does `dp[i]` (or `dp[i][j]`) mean? This is 80% of the work.
2. **Write the recurrence**: how does a state depend on smaller states?
3. **Base cases**: the smallest states you can fill directly.
4. **Order**: fill so every state's dependencies are already computed.
5. (Optional) **Optimize space**: if `dp[i]` only needs the last few rows, drop the rest.

---

## Pattern 1: 1-D DP — Climbing Stairs

State: `ways(n)` = number of ways to reach step `n` taking 1 or 2 steps. The last move was a
1-step (from `n-1`) or a 2-step (from `n-2`), so `ways(n) = ways(n-1) + ways(n-2)` — Fibonacci
again. Keeping only the last two values gives O(1) space.

```java
// dsa.dp.ClimbingStairs#ways
long twoBack = 1, oneBack = 1;          // ways(0), ways(1)
for (int step = 2; step <= n; step++) {
    long current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
}
return oneBack;
```

```text
Time: O(n)   Space: O(1)
```

---

## Pattern 2: Unbounded Choice — Coin Change (min coins)

State: `dp[a]` = fewest coins to make amount `a`. To make `a`, try each coin `c`: one `c` plus the
best way to make `a - c`. Build the table from 0 up to `amount`.

```java
// dsa.dp.CoinChange#minCoins
Arrays.fill(dp, amount + 1);  // "infinity" sentinel
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int coin : coins)
        if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
return dp[amount] > amount ? -1 : dp[amount];
```

```text
Time: O(amount × coins)   Space: O(amount)
```

Note: greedy ("always take the biggest coin") **fails** here — e.g. coins `{1,3,4}`, amount `6`:
greedy gives `4+1+1` (3 coins) but the optimum is `3+3` (2 coins). DP considers all choices.

---

## Pattern 3: 2-D DP — 0/1 Knapsack

State: `dp[i][w]` = best value using the first `i` items within capacity `w`. For each item, take
the better of **skipping** it or **including** it:

```java
// dsa.dp.Knapsack#maxValue
dp[i][w] = dp[i - 1][w];                                  // skip item i
if (weight <= w)
    dp[i][w] = Math.max(dp[i][w], value + dp[i - 1][w - weight]); // take item i
```

```text
Time: O(n × capacity)   Space: O(n × capacity)
```

This "include vs exclude, take the max" recurrence is the template for a huge family of DP
problems (subset sum, partition, longest common subsequence, edit distance).

---

## Complexity Summary

| Problem | State | Time | Space |
|---|---|---:|---:|
| Climbing stairs | `dp[n]` = ways to step n | `O(n)` | `O(1)` |
| Coin change (min) | `dp[a]` = min coins for `a` | `O(amount × coins)` | `O(amount)` |
| 0/1 knapsack | `dp[i][w]` = best value | `O(n × capacity)` | `O(n × capacity)` |
| (memoized Fibonacci, lesson 08) | `dp[n]` | `O(n)` | `O(n)` |

---

## For Experienced Devs

**The hard part is the state, not the code.** Most DP solutions are 5–15 lines. The skill is
phrasing the subproblem so it (a) composes into the full answer and (b) recurs. When stuck, write
the *recursive* brute force first, identify the repeated arguments, and those arguments **are** your
DP state — then add a cache (top-down) or a table (bottom-up).

**Space optimization is mechanical.** If `dp[i]` depends only on `dp[i-1]` (and maybe `dp[i-2]`),
you can collapse a 1-D table to a couple of variables (climbing stairs) or a 2-D table to one or
two rows (knapsack, LCS). Do it *after* you have a correct full-table version — premature rolling
is a top source of DP bugs.

**Pseudo-polynomial, not polynomial.** Knapsack/coin-change are `O(n × capacity)` — polynomial in
the *numeric value* of the capacity, which is exponential in its bit length. For huge capacities
this is not actually efficient; that's why knapsack is NP-hard in general. Worth knowing so you
don't promise "polynomial" in an interview.

**Top-down vs bottom-up in practice.** Top-down (recursion + `HashMap`/array cache via
`computeIfAbsent`) is easier to write from the recurrence and only visits reachable states.
Bottom-up avoids deep recursion (no `StackOverflowError`) and is usually a bit faster. For sparse
or hard-to-order state spaces, prefer memoization.

---

## Interview & Backend Notes

**Pattern triggers (DP is likely when you see):**

- "count the number of ways", "how many distinct..." → counting DP
- "minimum / maximum cost / length / value to achieve X" → optimization DP
- "can you partition / make / reach exactly..." → boolean/subset DP
- "longest / shortest subsequence / substring / path with a property" → sequence DP
- a recursive brute force with **overlapping** subproblems and **optimal substructure**

If subproblems *don't* overlap, it's plain divide-and-conquer (lesson 09), not DP. If a greedy
choice is provably always optimal, use greedy (simpler) — but verify, because greedy silently
fails on problems like coin change.

**Where DP-style thinking shows up in backend work:**

- **Caching/memoization**: the production cousin of DP — `@Cacheable`, memoizing expensive pure
  computations, dynamic-programming-style precomputation of aggregates.
- **Diffing & text**: edit distance / LCS power diff tools, fuzzy matching, spell-check,
  bioinformatics alignment.
- **Resource optimization**: knapsack-style allocation (bin packing, budget/capacity planning,
  scheduling under constraints).
- **Pricing / billing**: optimal-cost computations over choices with overlapping subproblems.

---

## Practice Problems

Add each solution as a method + test under `dsa.dp`.

1. **Climbing Stairs** (LeetCode 70) — warm-up 1-D DP.
2. **Coin Change** (LeetCode 322) and **Coin Change II** (518, count ways).
3. **House Robber** (LeetCode 198) — 1-D DP with a "skip or take" recurrence.
4. **Longest Common Subsequence** (LeetCode 1143) — 2-D DP, the LCS template.
5. **0/1 Knapsack** (classic) and **Partition Equal Subset Sum** (LeetCode 416, a knapsack variant).

---

## Quiz

### Q1

What two properties must a problem have for dynamic programming to apply?

### Q2

For `CoinChange.minCoins({1, 3, 4}, 6)`, a greedy "largest coin first" strategy gives what, and
what does DP give? Why does greedy fail?

### Q3

In 0/1 knapsack, `dp[i][w]` is the best value using the first `i` items with capacity `w`. Write
(in words) the recurrence for `dp[i][w]`.

---

## Answer Key

### Q1 Answer

**Optimal substructure** (the optimal solution is composed of optimal solutions to subproblems)
and **overlapping subproblems** (the same subproblems are solved repeatedly, so caching helps).
Without overlap it's just divide-and-conquer.

### Q2 Answer

Greedy takes `4`, then `1`, then `1` → **3 coins**. DP finds `3 + 3` → **2 coins**. Greedy fails
because a locally largest choice (the 4) forces a worse global outcome; DP evaluates every coin
choice for each amount and keeps the minimum.

### Q3 Answer

`dp[i][w]` = the maximum of **skipping** item `i` (`dp[i-1][w]`) and, if the item fits
(`weight[i] ≤ w`), **taking** it (`value[i] + dp[i-1][w - weight[i]]`). Base case: `dp[0][w] = 0`.

---

## Congratulations — You've Completed the Roadmap

You now have notes **and** runnable, tested Java for all 14 topics: complexity, arrays, strings,
linked lists, stacks, queues, hashing, recursion, sorting, searching, trees, BSTs, graphs, and
dynamic programming.

**Where to go next:**

- Work the **practice problems** at the end of each lesson — solve them as new methods + tests in
  the matching `dsa.*` package. That's where the learning sticks.
- Pick a track to go deeper: weighted graphs (Dijkstra, MST, union-find), advanced DP (sequence/
  grid/interval/bitmask), or balanced trees/heaps/tries.
- Do timed mixed-topic sets on LeetCode to build pattern-recognition speed.

```text
Quiz me with 10 mixed DSA problems and check my answers against the code in the code/ project.
```
