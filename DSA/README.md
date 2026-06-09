# DSA Course

A self-paced Data Structures & Algorithms course in Java, built for a working
backend engineer. Each topic ships **two** things:

1. A markdown lesson (notes, worked examples, complexity tables, quiz).
2. Runnable Java + JUnit tests under [`../code`](../code) you can execute and modify.

The overarching study guide and progress tracker lives in
[`../dsa-learning-roadmap.md`](../dsa-learning-roadmap.md).

## How to use this course

For each topic:

1. Read the lesson markdown.
2. Open the matching Java package and read the implementations (each method's
   Javadoc states its time/space complexity).
3. Read the tests to see expected behavior + edge cases.
4. Run them, tweak inputs, predict outcomes.
5. Solve the lesson's practice problems by adding your own methods + tests.

Run all code:

```bash
cd code && mvn test
```

## Topics

| # | Topic | Lesson | Code package | Status |
|---:|---|---|---|---|
| 01 | Foundations — complexity | [01-foundations](01-foundations/01-time-and-space-complexity-java-examples.md) | _(theory only)_ | ✅ |
| 02 | Arrays | [02-arrays](02-arrays/02-arrays-fundamentals-and-patterns.md) | `dsa.arrays` | ✅ |
| 03 | Strings | [03-strings](03-strings/03-strings-fundamentals-and-patterns.md) | `dsa.strings` | ✅ |
| 04 | Linked Lists | [04-linked-lists](04-linked-lists/04-linked-lists-fundamentals-and-patterns.md) | `dsa.linkedlists` | ✅ |
| 05 | Stack | [05-stack](05-stack/05-stack-fundamentals-and-patterns.md) | `dsa.stack` | ✅ |
| 06 | Queue | [06-queue](06-queue/06-queue-fundamentals-and-patterns.md) | `dsa.queue` | ✅ |
| 07 | Hashing (HashMap/HashSet) | [07-hashing](07-hashing/07-hashing-fundamentals-and-patterns.md) | `dsa.hashing` | ✅ |
| 08 | Recursion | [08-recursion](08-recursion/08-recursion-fundamentals-and-patterns.md) | `dsa.recursion` | ✅ |
| 09 | Sorting | [09-sorting](09-sorting/09-sorting-fundamentals-and-patterns.md) | `dsa.sorting` | ✅ |
| 10 | Searching | [10-searching](10-searching/10-searching-fundamentals-and-patterns.md) | `dsa.searching` | ✅ |
| 11 | Trees | [11-trees](11-trees/11-trees-fundamentals-and-patterns.md) | `dsa.trees` | ✅ |
| 12 | Binary Search Trees | [12-bst](12-bst/12-bst-fundamentals-and-patterns.md) | `dsa.bst` | ✅ |
| 13 | Graphs | [13-graphs](13-graphs/13-graphs-fundamentals-and-patterns.md) | `dsa.graphs` | ✅ |
| 14 | Dynamic Programming | [14-dynamic-programming](14-dynamic-programming/14-dynamic-programming-fundamentals-and-patterns.md) | `dsa.dp` | ✅ |

## Conventions

- **Topic folders**: `NN-topic-name/` — ordered, kebab-case, matching the roadmap order.
- **Lesson files**: `NN-descriptive-name.md`, prefixed with the topic number. A topic
  may hold multiple lessons (`NN-...-part-1.md`, `NN-...-part-2.md`).
- **Java packages** mirror topics: `dsa.arrays`, `dsa.strings`, … Tests mirror the same
  package under `code/src/test/java`.
- New lessons start from [`LESSON-TEMPLATE.md`](LESSON-TEMPLATE.md) (hybrid pitch:
  beginner core + experienced/interview/backend sections).
