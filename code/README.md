# DSA Course — Runnable Java

Compilable Java implementations and JUnit 5 tests that accompany the lessons in
[`../DSA`](../DSA). Every algorithm taught in a lesson lives here as real code you
can read, run, debug, and modify.

- **Java**: 21 (LTS)
- **Build**: Maven
- **Tests**: JUnit 5 (Jupiter)

## Run the tests

```bash
cd code
mvn test          # compile + run every test
```

Run a single topic or class:

```bash
mvn test -Dtest=ArrayBasicsTest        # one class
mvn test -Dtest='dsa.strings.*'        # one package
mvn test -Dtest=TwoSumTest#hashMapFindsPair   # one method
```

## Package → lesson map

| Package | Lesson | Key files |
|---|---|---|
| `dsa.arrays` | [02 — Arrays](../DSA/02-arrays/02-arrays-fundamentals-and-patterns.md) | `ArrayBasics`, `TwoSum`, `SlidingWindow`, `PrefixSum` |
| `dsa.strings` | [03 — Strings](../DSA/03-strings/03-strings-fundamentals-and-patterns.md) | `StringBasics`, `Palindrome`, `Anagram`, `LongestUniqueSubstring` |
| `dsa.linkedlists` | [04 — Linked Lists](../DSA/04-linked-lists/04-linked-lists-fundamentals-and-patterns.md) | `SinglyLinkedList`, `LinkedListAlgorithms` |
| `dsa.stack` | [05 — Stack](../DSA/05-stack/05-stack-fundamentals-and-patterns.md) | `ArrayStack`, `BalancedParentheses`, `MinStack`, `NextGreaterElement` |
| `dsa.queue` | [06 — Queue](../DSA/06-queue/06-queue-fundamentals-and-patterns.md) | `ArrayQueue`, `QueueUsingTwoStacks`, `SlidingWindowMaximum` |
| `dsa.hashing` | [07 — Hashing](../DSA/07-hashing/07-hashing-fundamentals-and-patterns.md) | `SimpleHashMap`, `Frequencies`, `GroupAnagrams` |
| `dsa.recursion` | [08 — Recursion](../DSA/08-recursion/08-recursion-fundamentals-and-patterns.md) | `RecursionBasics`, `Fibonacci`, `Subsets` |
| `dsa.sorting` | [09 — Sorting](../DSA/09-sorting/09-sorting-fundamentals-and-patterns.md) | `QuadraticSorts`, `MergeSort`, `QuickSort` |
| `dsa.searching` | [10 — Searching](../DSA/10-searching/10-searching-fundamentals-and-patterns.md) | `LinearSearch`, `BinarySearch` |
| `dsa.trees` | [11 — Trees](../DSA/11-trees/11-trees-fundamentals-and-patterns.md) | `TreeNode`, `BinaryTreeTraversals` |
| `dsa.bst` | [12 — Binary Search Trees](../DSA/12-bst/12-bst-fundamentals-and-patterns.md) | `BinarySearchTree` |
| `dsa.graphs` | [13 — Graphs](../DSA/13-graphs/13-graphs-fundamentals-and-patterns.md) | `Graph` |
| `dsa.dp` | [14 — Dynamic Programming](../DSA/14-dynamic-programming/14-dynamic-programming-fundamentals-and-patterns.md) | `ClimbingStairs`, `CoinChange`, `Knapsack` |

Tests mirror the same package names under `src/test/java`.

## How to study with this project

1. Read the lesson markdown for the topic.
2. Open the matching class under `src/main/java/dsa/<topic>` — each method's Javadoc
   states its time/space complexity.
3. Read the test to see the expected behavior and edge cases.
4. Try changing the input in a test, predict the result, then run it.
5. Implement the lesson's practice problems as new methods + tests.
