# DSA Learning Roadmap

Personal DSA learning notes for Parzival.

This document is meant to be a living guide. Use it whenever you want to continue learning Data Structures and Algorithms from where you left off.

---

## Document Index

Main grouped DSA folder:

```text
/home/hari/Courses/DSA
```

Course guide and conventions: [DSA/README.md](DSA/README.md) ·
Lesson template: [DSA/LESSON-TEMPLATE.md](DSA/LESSON-TEMPLATE.md)

Lessons now ship with **runnable Java + JUnit tests** under [code/](code/README.md).
Run them all with `cd code && mvn test`.

Lesson notes:

- [01 - Time and Space Complexity Java Examples](DSA/01-foundations/01-time-and-space-complexity-java-examples.md)
- [02 - Arrays: Fundamentals and Patterns](DSA/02-arrays/02-arrays-fundamentals-and-patterns.md) — code: `dsa.arrays`
- [03 - Strings: Fundamentals and Patterns](DSA/03-strings/03-strings-fundamentals-and-patterns.md) — code: `dsa.strings`
- [04 - Linked Lists: Fundamentals and Patterns](DSA/04-linked-lists/04-linked-lists-fundamentals-and-patterns.md) — code: `dsa.linkedlists`
- [05 - Stack: Fundamentals and Patterns](DSA/05-stack/05-stack-fundamentals-and-patterns.md) — code: `dsa.stack`
- [06 - Queue: Fundamentals and Patterns](DSA/06-queue/06-queue-fundamentals-and-patterns.md) — code: `dsa.queue`
- [07 - Hashing: HashMap, HashSet, and Patterns](DSA/07-hashing/07-hashing-fundamentals-and-patterns.md) — code: `dsa.hashing`
- [08 - Recursion: Fundamentals and Patterns](DSA/08-recursion/08-recursion-fundamentals-and-patterns.md) — code: `dsa.recursion`
- [09 - Sorting: Fundamentals and Patterns](DSA/09-sorting/09-sorting-fundamentals-and-patterns.md) — code: `dsa.sorting`
- [10 - Searching: Fundamentals and Patterns](DSA/10-searching/10-searching-fundamentals-and-patterns.md) — code: `dsa.searching`
- [11 - Trees: Fundamentals and Patterns](DSA/11-trees/11-trees-fundamentals-and-patterns.md) — code: `dsa.trees`
- [12 - Binary Search Trees: Fundamentals and Patterns](DSA/12-bst/12-bst-fundamentals-and-patterns.md) — code: `dsa.bst`
- [13 - Graphs: Fundamentals and Patterns](DSA/13-graphs/13-graphs-fundamentals-and-patterns.md) — code: `dsa.graphs`
- [14 - Dynamic Programming: Fundamentals and Patterns](DSA/14-dynamic-programming/14-dynamic-programming-fundamentals-and-patterns.md) — code: `dsa.dp`

Naming pattern:

```text
NN-topic-name/NN-descriptive-name.md
```

Use ordered kebab-case filenames and grouped topic folders.

---

## Current Status

So far, you have read about:

- What is DSA?
- What are data structures?
- Types of data structures
- What are algorithms?
- Types of algorithms
- Asymptotic notation
- Big O, Omega, and Theta notation

**All 14 roadmap topics are complete** — each with notes plus runnable Java + JUnit tests:

- 01 Time & space complexity · 02 Arrays · 03 Strings · 04 Linked lists · 05 Stacks
- 06 Queues · 07 Hashing · 08 Recursion · 09 Sorting · 10 Searching
- 11 Trees · 12 Binary search trees · 13 Graphs · 14 Dynamic programming

Run all the code with `cd code && mvn test` (139 tests).

You are currently up to:

- Working through the **practice problems** at the end of each lesson — solve them as new
  methods + tests in the matching `dsa.*` package.
- Going deeper on a chosen track: weighted graphs (Dijkstra, MST, union-find), advanced DP, or
  balanced trees / heaps / tries.

Reference page you started with:

- https://www.wscubetech.com/resources/dsa/asymptotic-notation

---

## Should You Follow WsCubeTech?

Short answer: yes, but not as the only resource.

WsCubeTech is useful for beginner-friendly introductions. It gives simple definitions and examples, which is good when starting out.

However, for DSA, reading alone is not enough. DSA becomes clear only when you solve small problems and analyze code repeatedly.

Use WsCubeTech for:

- First-pass explanations
- Simple definitions
- Topic ordering
- Basic examples

But pair it with:

- Visual examples
- Java code practice
- Problem solving
- Complexity analysis exercises

Recommended extra resources:

- VisuAlgo: https://visualgo.net/
- Big-O Cheat Sheet: https://www.bigocheatsheet.com/
- William Fiset DSA course on YouTube
- freeCodeCamp DSA tutorials
- LeetCode easy problems after basics
- HackerRank beginner problems

---

## Important Mindset

DSA may feel hard at first because it combines:

- Programming
- Mathematical thinking
- Pattern recognition
- Problem solving
- Memory of common techniques

Feeling weak in DSA does not mean you are bad at programming. It means you are still building the mental patterns.

The goal is not to memorize everything immediately.

The goal is to repeatedly ask:

> How does this algorithm behave as input size grows?

---

# Part 1: Time and Space Complexity

## What Is Input Size?

Input size is usually written as `n`.

Examples:

- If an array has 10 elements, then `n = 10`
- If a string has 100 characters, then `n = 100`
- If a linked list has 50 nodes, then `n = 50`
- If a graph has vertices and edges, we often use `V` and `E`
- If there are two arrays, we may use `n` and `m`

Complexity asks:

> As `n` grows, how much more work or memory does the algorithm need?

---

## What Is Time Complexity?

Time complexity describes how the number of operations grows as the input size grows.

It does not measure actual seconds.

Why not?

Because actual time depends on:

- CPU speed
- Programming language
- Compiler
- Operating system
- Hardware
- Background processes

Instead, we count how the algorithm grows.

Example:

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

This loop runs `n` times.

So the time complexity is:

```text
O(n)
```

---

## What Is Space Complexity?

Space complexity describes how much extra memory an algorithm uses as input size grows.

Usually, we do not count the input itself. We count additional memory created by the algorithm.

Example:

```java
int sum = 0;

for (int i = 0; i < arr.length; i++) {
    sum += arr[i];
}
```

Extra memory:

- `sum`
- `i`

Only a fixed number of variables are used.

Space complexity:

```text
O(1)
```

Example with extra array:

```java
int[] copy = new int[n];

for (int i = 0; i < n; i++) {
    copy[i] = arr[i];
}
```

Here we create a new array of size `n`.

Space complexity:

```text
O(n)
```

---

# Part 2: Big O, Omega, and Theta

## Big O Notation: O

Big O describes an upper bound.

In beginner DSA, we often use Big O to describe the worst-case growth of an algorithm.

Example:

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

The loop runs at most `n` times.

Time complexity:

```text
O(n)
```

---

## Omega Notation: Ω

Omega describes a lower bound.

It tells us the minimum growth an algorithm can have.

Beginner simplification:

- Omega is often used to describe best-case behavior.

---

## Theta Notation: Θ

Theta describes a tight bound.

It means the algorithm grows at the same rate from both upper and lower bound perspectives.

Example:

If an algorithm always performs `3n + 2` operations, then:

```text
O(n)
Ω(n)
Θ(n)
```

Because it is tightly linear.

---

## Important Correction

Some beginner tutorials say:

- Big O = worst case
- Omega = best case
- Theta = average case

This is a simplification.

More correct:

- Big O = upper bound
- Omega = lower bound
- Theta = tight bound

For now, focus mostly on Big O. It is the most commonly used notation in interviews and problem solving.

---

# Part 3: Common Complexity Types

From fastest to slowest in common cases:

```text
O(1)       Constant
O(log n)   Logarithmic
O(n)       Linear
O(n log n) Linearithmic
O(n^2)     Quadratic
O(2^n)     Exponential
O(n!)      Factorial
```

---

## O(1): Constant Time

The algorithm takes the same amount of work regardless of input size.

Example:

```java
int first = arr[0];
```

Whether the array has 10 elements or 1 million elements, accessing index `0` is constant time.

Time complexity:

```text
O(1)
```

---

## O(n): Linear Time

The work grows directly with input size.

Example:

```java
for (int i = 0; i < n; i++) {
    System.out.println(arr[i]);
}
```

If `n = 10`, loop runs 10 times.
If `n = 1000`, loop runs 1000 times.

Time complexity:

```text
O(n)
```

---

## O(n²): Quadratic Time

Usually caused by nested loops.

Example:

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + " " + j);
    }
}
```

Outer loop runs `n` times.
Inner loop runs `n` times for every outer loop.

Total:

```text
n * n = n²
```

Time complexity:

```text
O(n²)
```

---

## O(log n): Logarithmic Time

Usually happens when the input is repeatedly divided.

Example:

```java
while (n > 1) {
    n = n / 2;
}
```

If `n = 16`:

```text
16 -> 8 -> 4 -> 2 -> 1
```

Only 4 steps.

Time complexity:

```text
O(log n)
```

Common example:

- Binary search

---

## O(n log n)

Common in efficient sorting algorithms.

Examples:

- Merge sort
- Quick sort average case
- Heap sort

You do not need to deeply understand this immediately, but recognize that it is usually better than `O(n²)` for large input.

---

## O(2^n): Exponential Time

Often appears in brute-force recursive solutions where each call branches into multiple calls.

Example pattern:

```java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

This recursive Fibonacci implementation repeats a lot of work.

Time complexity:

```text
O(2^n)
```

---

# Part 4: Rules for Calculating Time Complexity

## Rule 1: Single Statement Is O(1)

```java
int x = arr[0];
```

Time:

```text
O(1)
```

---

## Rule 2: One Loop Over n Elements Is O(n)

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

Time:

```text
O(n)
```

---

## Rule 3: Two Separate Loops Are Added

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}

for (int j = 0; j < n; j++) {
    System.out.println(j);
}
```

First loop: `n`
Second loop: `n`

Total:

```text
n + n = 2n
```

Big O ignores constants:

```text
O(2n) -> O(n)
```

Final time complexity:

```text
O(n)
```

---

## Rule 4: Nested Loops Are Multiplied

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + j);
    }
}
```

Total:

```text
n * n = n²
```

Time:

```text
O(n²)
```

---

## Rule 5: Keep the Dominant Term

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + j);
    }
}
```

First part:

```text
O(n)
```

Second part:

```text
O(n²)
```

Total:

```text
O(n + n²)
```

Dominant term is `n²`.

Final:

```text
O(n²)
```

---

## Rule 6: Ignore Constants

Example:

```text
T(n) = 3n + 10
```

Ignore constants and coefficients:

```text
O(n)
```

Example:

```text
T(n) = 5n² + 100n + 20
```

Dominant term is `n²`.

Final:

```text
O(n²)
```

---

## Rule 7: Different Inputs Need Different Variables

```java
for (int i = 0; i < a.length; i++) {
    System.out.println(a[i]);
}

for (int j = 0; j < b.length; j++) {
    System.out.println(b[j]);
}
```

If:

- `a.length = n`
- `b.length = m`

Then time complexity is:

```text
O(n + m)
```

Do not blindly say `O(n)` when there are different input sizes.

---

## Rule 8: Recursive Calls Count Too

```java
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```

Calls:

```text
factorial(5)
factorial(4)
factorial(3)
factorial(2)
factorial(1)
factorial(0)
```

There are about `n` calls.

Time:

```text
O(n)
```

Space:

```text
O(n)
```

Why space is `O(n)`?

Because recursive calls stay on the call stack until they return.

---

# Part 5: Rules for Calculating Space Complexity

## Rule 1: A Few Variables Is O(1)

```java
int sum = 0;
int max = arr[0];
```

Extra memory does not grow with input.

Space:

```text
O(1)
```

---

## Rule 2: New Array of Size n Is O(n)

```java
int[] result = new int[n];
```

Space:

```text
O(n)
```

---

## Rule 3: New Matrix of Size n by n Is O(n²)

```java
int[][] matrix = new int[n][n];
```

Space:

```text
O(n²)
```

---

## Rule 4: Recursion Uses Stack Space

```java
void print(int n) {
    if (n == 0) return;
    print(n - 1);
}
```

There are `n` recursive calls.

Space:

```text
O(n)
```

---

# Part 6: Complexity Analysis Checklist

When analyzing any algorithm, follow this checklist:

1. Identify the input size.
   - Is it `n`?
   - Is it `n` and `m`?
   - Is it rows and columns?

2. Find the main operations.
   - Loops
   - Comparisons
   - Assignments
   - Recursive calls
   - Array or map operations

3. Count how many times operations run.
   - Once: `O(1)`
   - n times: `O(n)`
   - n * n times: `O(n²)`
   - halving each time: `O(log n)`

4. Add separate parts.
   - `O(n) + O(n²)`

5. Keep the biggest term.
   - `O(n + n²) -> O(n²)`

6. Remove constants.
   - `O(2n) -> O(n)`
   - `O(5n²) -> O(n²)`

7. Analyze extra memory.
   - Few variables: `O(1)`
   - New array: `O(n)`
   - Matrix: `O(n²)`
   - Recursive stack: depends on recursion depth

---

# Part 7: Beginner Practice Examples

## Example A

```java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
```

Analysis:

- One loop
- Runs `n` times
- No extra growing memory

Answer:

```text
Time: O(n)
Space: O(1)
```

---

## Example B

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + j);
    }
}
```

Analysis:

- Nested loop
- Outer loop: `n`
- Inner loop: `n`
- Total: `n * n`

Answer:

```text
Time: O(n²)
Space: O(1)
```

---

## Example C

```java
int[] result = new int[n];

for (int i = 0; i < n; i++) {
    result[i] = arr[i] * 2;
}
```

Analysis:

- Loop runs `n` times
- New array of size `n`

Answer:

```text
Time: O(n)
Space: O(n)
```

---

## Example D

```java
while (n > 1) {
    n = n / 2;
}
```

Analysis:

- Input is divided by 2 each time
- This is logarithmic

Answer:

```text
Time: O(log n)
Space: O(1)
```

---

## Example E

```java
int sum = 0;

for (int i = 0; i < n; i++) {
    sum += arr[i];
}

for (int i = 0; i < n; i++) {
    System.out.println(arr[i]);
}
```

Analysis:

- First loop: `O(n)`
- Second loop: `O(n)`
- Total: `O(2n)`
- Ignore constant 2

Answer:

```text
Time: O(n)
Space: O(1)
```

---

## Example F

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        System.out.println(i + j);
    }
}
```

Analysis:

- Outer loop runs `n` times
- Inner loop runs `m` times
- Total: `n * m`

Answer:

```text
Time: O(n * m)
Space: O(1)
```

---

# Part 8: Suggested Learning Order

Do not jump directly into advanced topics. Build the foundation slowly.

Recommended order:

1. Time and Space Complexity
2. Arrays
3. Strings
4. Linked Lists
5. Stack
6. Queue
7. HashMap and HashSet
8. Recursion
9. Sorting
10. Searching
11. Trees
12. Binary Search Trees
13. Graphs
14. Dynamic Programming

For now, focus only on:

```text
Complexity -> Arrays -> Strings
```

These three are the foundation.

---

# Part 9: How to Study Each Topic

For every topic, use this method:

1. Read a simple explanation.
2. Watch a visual explanation.
3. Code the data structure or algorithm in Java.
4. Solve 3 to 5 beginner problems.
5. Write the time and space complexity.
6. Review mistakes.
7. Move to the next topic only after basic comfort.

Do not only read. DSA requires active practice.

---

# Part 10: Immediate Next Step

Next session should be:

```text
Time and Space Complexity: 10 beginner examples in Java
```

Goal:

- Look at small Java snippets
- Guess time complexity
- Guess space complexity
- Compare with explanation
- Build confidence

After that, move to:

```text
Arrays basics in Java
```

---

# Quick Cheat Sheet

## Time Complexity Patterns

```text
Single statement                  O(1)
One loop                          O(n)
Two separate loops                O(n)
Nested loop n x n                 O(n²)
Nested loop n x m                 O(n*m)
Loop dividing by 2                O(log n)
Efficient sorting                 O(n log n)
Recursive factorial               O(n)
Naive recursive Fibonacci         O(2^n)
```

## Space Complexity Patterns

```text
Few variables                     O(1)
New array of size n               O(n)
New matrix n x n                  O(n²)
Recursive call depth n            O(n)
HashMap storing n items           O(n)
```

---

# Notes to Remember

- Big O ignores constants.
- Big O ignores smaller terms.
- Nested loops usually multiply.
- Separate loops usually add.
- Recursion uses call stack memory.
- Creating arrays, lists, maps, or sets affects space complexity.
- Input size can be `n`, `m`, rows/columns, vertices/edges, etc.
- Focus on growth, not exact execution time.
- DSA becomes easier through practice, not passive reading.

---

# Progress Tracker

Use this section to track your progress.

```text
[x] Understand Big O basics
[x] Understand time complexity
[x] Understand space complexity
[x] Practice 10 complexity examples
[x] Learn arrays           (lesson 02 + dsa.arrays code)
[ ] Solve 5 array problems  (see lesson 02 practice list)
[x] Learn strings          (lesson 03 + dsa.strings code)
[ ] Solve 5 string problems (see lesson 03 practice list)
[x] Learn linked lists     (lesson 04 + dsa.linkedlists code)
[x] Learn stack            (lesson 05 + dsa.stack code)
[x] Learn queue            (lesson 06 + dsa.queue code)
[x] Learn HashMap / HashSet (lesson 07 + dsa.hashing code)
[x] Learn recursion        (lesson 08 + dsa.recursion code)
[x] Learn sorting          (lesson 09 + dsa.sorting code)
[x] Learn searching        (lesson 10 + dsa.searching code)
[x] Learn trees            (lesson 11 + dsa.trees code)
[x] Learn binary search trees (lesson 12 + dsa.bst code)
[x] Learn graphs           (lesson 13 + dsa.graphs code)
[x] Learn dynamic programming basics (lesson 14 + dsa.dp code)
[ ] Solve the practice problems at the end of each lesson
```

---

# Continue From Here

To resume, say:

```text
Continue my DSA learning from ~/Courses/dsa-learning-roadmap.md
```

All 14 topics are written. Recommended next step — drill the practice problems:

```text
Quiz me with 10 mixed DSA problems and check my answers against the code in the code/ project.
```

Or go deeper on a track:

```text
Teach me weighted-graph shortest paths (Dijkstra) in Java with runnable code + tests, and document it in the DSA folder.
```
