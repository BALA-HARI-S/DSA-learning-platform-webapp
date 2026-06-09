# Time and Space Complexity: 10 Beginner Java Examples

## Overview

This document continues the DSA learning roadmap and focuses on one essential skill:

> Given a Java code snippet, identify its time complexity and space complexity.

Time complexity answers:

> How does the amount of work grow as input size grows?

Space complexity answers:

> How much extra memory does the algorithm use as input size grows?

For most beginner DSA analysis, the input size is written as `n`.

Examples:

- Array length: `n = arr.length`
- String length: `n = str.length()`
- Linked list size: `n = number of nodes`
- Two arrays: `n = a.length`, `m = b.length`

---

## Table of Contents

1. [Key Concepts](#key-concepts)
2. [Complexity Rules Recap](#complexity-rules-recap)
3. [Example 1: Constant Time](#example-1-constant-time)
4. [Example 2: Linear Time](#example-2-linear-time)
5. [Example 3: Two Separate Loops](#example-3-two-separate-loops)
6. [Example 4: Nested Loops](#example-4-nested-loops)
7. [Example 5: Creating a New Array](#example-5-creating-a-new-array)
8. [Example 6: Find Maximum](#example-6-find-maximum)
9. [Example 7: Logarithmic Time](#example-7-logarithmic-time)
10. [Example 8: Nested Loop with Different Inputs](#example-8-nested-loop-with-different-inputs)
11. [Example 9: Recursion](#example-9-recursion)
12. [Example 10: HashSet Duplicate Check](#example-10-hashset-duplicate-check)
13. [Summary Table](#summary-table)
14. [Mini Quiz](#mini-quiz)
15. [Answer Key](#answer-key)
16. [Next Steps](#next-steps)

---

## Key Concepts

### Time Complexity

Time complexity describes how the number of operations grows as input size grows.

It does not measure actual seconds because real time depends on hardware, CPU speed, programming language, compiler, operating system, and background processes.

Instead of asking:

> How many seconds does this take?

We ask:

> As `n` grows, how does the number of operations grow?

---

### Space Complexity

Space complexity describes how much extra memory an algorithm uses as input size grows.

Usually, we do not count the input itself.

Example:

```java
public int sumArray(int[] arr) {
    int sum = 0;
    for (int num : arr) {
        sum += num;
    }
    return sum;
}
```

The input array `arr` is already given to the method. We do not count it as extra space.

Extra memory used:

- `sum`
- `num`

That is constant extra memory.

Space complexity:

```text
O(1)
```

But if we create a new array inside the method, that does count.

```java
int[] result = new int[arr.length];
```

This creates extra memory proportional to `n`.

Space complexity:

```text
O(n)
```

---

## Complexity Rules Recap

### Time Complexity Patterns

| Pattern | Complexity |
|---|---:|
| Single direct operation | `O(1)` |
| One loop over input | `O(n)` |
| Two separate loops over same input | `O(n + n) -> O(n)` |
| Nested loop over same input | `O(n * n) -> O(n²)` |
| Nested loop over two different inputs | `O(n * m)` |
| Input divided by 2 repeatedly | `O(log n)` |
| Efficient sorting | `O(n log n)` |
| Simple recursion reducing by 1 | `O(n)` |
| Naive branching recursion | Often `O(2^n)` |

### Space Complexity Patterns

| Pattern | Complexity |
|---|---:|
| Few variables | `O(1)` |
| New array of size `n` | `O(n)` |
| New matrix `n x n` | `O(n²)` |
| HashMap / HashSet storing `n` items | `O(n)` |
| Recursion depth `n` | `O(n)` |

---

## Example 1: Constant Time

### Code

```java
public int getFirstElement(int[] arr) {
    return arr[0];
}
```

### Analysis

If the array has 10 elements, the method returns the first element.

If the array has 1,000,000 elements, the method still returns the first element.

It does not loop. It does not scan the array. It directly accesses one index.

### Time Complexity

```text
O(1)
```

The work is constant.

### Space Complexity

```text
O(1)
```

No extra memory grows with input size.

### Final Answer

```text
Time: O(1)
Space: O(1)
```

### Pattern to Remember

Direct array access is usually constant time:

```java
arr[0]
arr[5]
arr[n - 1]
```

---

## Example 2: Linear Time

### Code

```java
public void printAllElements(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.println(arr[i]);
    }
}
```

### Analysis

Let:

```text
n = arr.length
```

If the array has 5 elements, the loop runs 5 times.

If the array has 100 elements, the loop runs 100 times.

If the array has 1,000,000 elements, the loop runs 1,000,000 times.

The work grows directly with input size.

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(1)
```

Only a loop variable is used. No extra array/list/map is created.

### Final Answer

```text
Time: O(n)
Space: O(1)
```

### Pattern to Remember

One loop through the input usually means:

```text
O(n)
```

---

## Example 3: Two Separate Loops

### Code

```java
public void printTwice(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.println(arr[i]);
    }

    for (int i = 0; i < arr.length; i++) {
        System.out.println(arr[i]);
    }
}
```

### Analysis

Let:

```text
n = arr.length
```

First loop runs `n` times.

Second loop runs `n` times.

Total work:

```text
n + n = 2n
```

Big O ignores constant multipliers:

```text
O(2n) -> O(n)
```

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(1)
```

Only fixed variables are used.

### Final Answer

```text
Time: O(n)
Space: O(1)
```

### Pattern to Remember

Separate loops are added:

```text
n + n = 2n -> O(n)
```

Nested loops are multiplied:

```text
n * n = n² -> O(n²)
```

---

## Example 4: Nested Loops

### Code

```java
public void printPairs(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length; j++) {
            System.out.println(arr[i] + ", " + arr[j]);
        }
    }
}
```

### Analysis

Let:

```text
n = arr.length
```

Outer loop runs `n` times.

For every one outer loop iteration, the inner loop runs `n` times.

Total work:

```text
n * n = n²
```

If `n = 3`, total print operations are:

```text
3 * 3 = 9
```

### Time Complexity

```text
O(n²)
```

### Space Complexity

```text
O(1)
```

No extra growing memory is created.

### Final Answer

```text
Time: O(n²)
Space: O(1)
```

### Pattern to Remember

Nested loop over the same input usually means:

```text
O(n²)
```

---

## Example 5: Creating a New Array

### Code

```java
public int[] doubleValues(int[] arr) {
    int[] result = new int[arr.length];

    for (int i = 0; i < arr.length; i++) {
        result[i] = arr[i] * 2;
    }

    return result;
}
```

### Analysis

Let:

```text
n = arr.length
```

The loop runs `n` times.

The method also creates a new array:

```java
int[] result = new int[arr.length];
```

If input has 10 elements, `result` has 10 elements.

If input has 1,000,000 elements, `result` has 1,000,000 elements.

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(n)
```

The new result array grows with input size.

### Final Answer

```text
Time: O(n)
Space: O(n)
```

### Pattern to Remember

Creating a new array of size `n` usually means:

```text
Space: O(n)
```

---

## Example 6: Find Maximum

### Code

```java
public int findMax(int[] arr) {
    int max = arr[0];

    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}
```

### Analysis

Let:

```text
n = arr.length
```

The algorithm checks each element once.

The `if` statement does not create another loop. It is just a constant-time check inside the loop.

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(1)
```

Extra variables:

```java
int max
int i
```

Only fixed memory is used.

### Final Answer

```text
Time: O(n)
Space: O(1)
```

### Pattern to Remember

An `if` inside a loop does not automatically make the algorithm `O(n²)`.

This pattern is usually still linear:

```java
for (...) {
    if (...) {
        ...
    }
}
```

Unless the `if` block contains another loop or expensive operation.

---

## Example 7: Logarithmic Time

### Code

```java
public void divideByTwo(int n) {
    while (n > 1) {
        n = n / 2;
    }
}
```

### Analysis

This loop does not reduce `n` by 1.

It divides `n` by 2 each time.

If `n = 16`:

```text
16 -> 8 -> 4 -> 2 -> 1
```

Only 4 steps.

If `n = 1024`:

```text
1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
```

Only 10 steps.

That is much faster than looping from `1` to `n`.

### Time Complexity

```text
O(log n)
```

### Space Complexity

```text
O(1)
```

No extra growing memory is used.

### Final Answer

```text
Time: O(log n)
Space: O(1)
```

### Pattern to Remember

If the input is repeatedly divided by 2, think:

```text
O(log n)
```

Common example:

```text
Binary search
```

---

## Example 8: Nested Loop with Different Inputs

### Code

```java
public void printCombinations(int[] a, int[] b) {
    for (int i = 0; i < a.length; i++) {
        for (int j = 0; j < b.length; j++) {
            System.out.println(a[i] + ", " + b[j]);
        }
    }
}
```

### Analysis

There are two input arrays.

Let:

```text
n = a.length
m = b.length
```

Outer loop runs `n` times.

Inner loop runs `m` times for every outer loop iteration.

Total work:

```text
n * m
```

### Time Complexity

```text
O(n * m)
```

### Space Complexity

```text
O(1)
```

No extra growing memory is used.

### Final Answer

```text
Time: O(n * m)
Space: O(1)
```

### Pattern to Remember

If there are two different input sizes, use two different variables.

Do not blindly say `O(n)` for everything.

---

## Example 9: Recursion

### Code

```java
public int factorial(int n) {
    if (n == 0) {
        return 1;
    }

    return n * factorial(n - 1);
}
```

### Analysis

Example call:

```java
factorial(5)
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

### Time Complexity

```text
O(n)
```

Each call does a small amount of work, and there are about `n` calls.

### Space Complexity

```text
O(n)
```

Each recursive call stays in memory until it returns. This memory is called the call stack.

If there are `n` recursive calls, stack memory grows with `n`.

### Final Answer

```text
Time: O(n)
Space: O(n)
```

### Pattern to Remember

Recursive algorithms can use extra space even if no array/list/map is created.

Reason:

```text
Recursion uses call stack memory.
```

---

## Example 10: HashSet Duplicate Check

### Code

```java
import java.util.HashSet;
import java.util.Set;

public boolean hasDuplicate(int[] arr) {
    Set<Integer> seen = new HashSet<>();

    for (int num : arr) {
        if (seen.contains(num)) {
            return true;
        }

        seen.add(num);
    }

    return false;
}
```

### Analysis

Let:

```text
n = arr.length
```

The algorithm loops through the array once.

For each element, it uses HashSet operations:

```java
seen.contains(num)
seen.add(num)
```

HashSet operations are usually `O(1)` on average.

So total time is linear.

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(n)
```

In the worst case, there are no duplicates. Then every element is stored in the HashSet.

### Final Answer

```text
Time: O(n)
Space: O(n)
```

### Pattern to Remember

HashMap and HashSet often improve time complexity, but they usually cost extra space.

---

## Summary Table

| # | Example | Time | Space | Key Idea |
|---:|---|---:|---:|---|
| 1 | Get first element | `O(1)` | `O(1)` | Direct access |
| 2 | Print all elements | `O(n)` | `O(1)` | One loop |
| 3 | Two separate loops | `O(n)` | `O(1)` | Add loops, ignore constants |
| 4 | Nested loops | `O(n²)` | `O(1)` | Multiply nested loops |
| 5 | Create result array | `O(n)` | `O(n)` | New array of size `n` |
| 6 | Find max | `O(n)` | `O(1)` | One scan, fixed variables |
| 7 | Divide by two | `O(log n)` | `O(1)` | Repeated halving |
| 8 | Nested loop with `n` and `m` | `O(n*m)` | `O(1)` | Different input sizes |
| 9 | Factorial recursion | `O(n)` | `O(n)` | Recursive call stack |
| 10 | HashSet duplicate check | `O(n)` average | `O(n)` | Store seen values |

---

## Mini Quiz

Try to solve these before checking the answer key.

### Quiz 1

```java
public int getLast(int[] arr) {
    return arr[arr.length - 1];
}
```

Question:

```text
Time: ?
Space: ?
```

---

### Quiz 2

```java
public int sumArray(int[] arr) {
    int sum = 0;

    for (int num : arr) {
        sum += num;
    }

    return sum;
}
```

Question:

```text
Time: ?
Space: ?
```

---

### Quiz 3

```java
public void printTriangle(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            System.out.println(i + ", " + j);
        }
    }
}
```

Hint:

The inner loop does not always run `n` times.

It runs:

```text
0 + 1 + 2 + 3 + ... + n
```

This still simplifies to `O(n²)`.

Question:

```text
Time: ?
Space: ?
```

---

### Quiz 4

```java
public int[] copyArray(int[] arr) {
    int[] copy = new int[arr.length];

    for (int i = 0; i < arr.length; i++) {
        copy[i] = arr[i];
    }

    return copy;
}
```

Question:

```text
Time: ?
Space: ?
```

---

### Quiz 5

```java
public boolean containsValue(int[] arr, int target) {
    for (int num : arr) {
        if (num == target) {
            return true;
        }
    }

    return false;
}
```

Question:

```text
Worst-case time: ?
Best-case time: ?
Space: ?
```

---

## Answer Key

### Quiz 1 Answer

```text
Time: O(1)
Space: O(1)
```

Explanation:

Accessing the last index directly is constant time.

---

### Quiz 2 Answer

```text
Time: O(n)
Space: O(1)
```

Explanation:

The loop visits every element once. Only fixed variables are used.

---

### Quiz 3 Answer

```text
Time: O(n²)
Space: O(1)
```

Explanation:

The number of inner loop runs is:

```text
0 + 1 + 2 + ... + (n - 1)
```

This equals:

```text
n(n - 1) / 2
```

When simplified for Big O:

```text
O(n²)
```

---

### Quiz 4 Answer

```text
Time: O(n)
Space: O(n)
```

Explanation:

The loop copies every element once. The method creates a new array of size `n`.

---

### Quiz 5 Answer

```text
Worst-case time: O(n)
Best-case time: O(1)
Space: O(1)
```

Explanation:

Best case: the target is the first element, so the method returns immediately.

Worst case: the target is at the end or not present, so the method scans the entire array.

Space is constant because no extra growing data structure is created.

---

## Practical Applications

Understanding time and space complexity helps you:

- Compare different solutions to the same problem
- Avoid slow nested-loop solutions when input grows large
- Understand why HashMap/HashSet solutions can be faster
- Recognize when extra memory is being used
- Prepare for coding interviews and technical problem solving
- Write better backend code when processing collections, files, requests, and database results

---

## References

- WsCubeTech asymptotic notation page: https://www.wscubetech.com/resources/dsa/asymptotic-notation
- VisuAlgo: https://visualgo.net/
- Big-O Cheat Sheet: https://www.bigocheatsheet.com/
- William Fiset Data Structures course on YouTube
- freeCodeCamp Data Structures and Algorithms tutorials

---

## Next Steps

Recommended next learning session:

```text
Arrays basics in Java
```

This is now covered in [02 — Arrays](../02-arrays/02-arrays-fundamentals-and-patterns.md),
with runnable code under `dsa.arrays`.

Before moving on, practice identifying complexity for small snippets until these patterns feel natural:

```text
O(1)
O(n)
O(n²)
O(log n)
O(n) space
O(1) space
```

Suggested prompt to continue:

```text
Continue my DSA learning with Arrays basics in Java and document it in the DSA folder.
```
