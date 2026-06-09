# 06 — Queue: Fundamentals and Patterns

> Prerequisite: [05 — Stack](../05-stack/05-stack-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/queue`](../../code/src/main/java/dsa/queue) ·
> tests: `cd code && mvn test -Dtest='dsa.queue.*'`

## Overview

A queue is a **FIFO** (first in, first out) collection — the mirror image of the stack. The
first thing you put in is the first thing you take out, like a line at a checkout. Its core
operations are all O(1):

- **enqueue** — add to the back
- **dequeue** — remove and return the front
- **peek** — look at the front without removing it

Queues model "process things in the order they arrived" — exactly what BFS, schedulers, and
message systems need.

**You will learn to:**

- Implement a queue efficiently with a circular array (and know why naïve array queues are slow).
- Use the right JDK type (`ArrayDeque`) and understand the `Deque` family.
- Apply queue/deque patterns: queue-from-two-stacks and the monotonic-deque sliding-window maximum.

---

## Core Concept

### FIFO in one picture

```text
enqueue(1) enqueue(2) enqueue(3)      dequeue() -> 1      dequeue() -> 2
front → [1][2][3] ← back              front → [2][3]      front → [3]
```

### Why a circular array

A naïve array queue that removes from index 0 must shift every remaining element left — O(n)
per dequeue. The fix is a **circular buffer**: keep a `head` and `tail` index that wrap around
with modulo arithmetic, so neither end ever shifts.

```java
// dsa.queue.ArrayQueue
public void enqueue(T value) {
    if (size == elements.length) grow();
    elements[tail] = value;
    tail = (tail + 1) % elements.length;   // wrap around
    size++;
}
public T dequeue() {
    T value = (T) elements[head];
    elements[head] = null;                 // allow GC
    head = (head + 1) % elements.length;
    size--;
    return value;
}
```

| Operation | Time | Space |
|---|---:|---:|
| enqueue | `O(1)` amortized | `O(1)` amortized |
| dequeue | `O(1)` | `O(1)` |
| peek | `O(1)` | `O(1)` |

A linked-list-backed queue (enqueue at tail, dequeue at head, both with pointers) is also O(1) —
the array-vs-linked trade-off from lesson 04 applies again.

---

## Pattern 1: Queue From Two Stacks

A classic interview question that proves you understand both LIFO and FIFO. An `in` stack takes
pushes; an `out` stack serves removals. Pouring `in` into `out` reverses the order, so the oldest
element ends up on top of `out`.

```java
// dsa.queue.QueueUsingTwoStacks
public T dequeue() {
    if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop()); // reverse, once
    return out.pop();
}
```

Each element is transferred at most once, so dequeue is **amortized O(1)** despite the occasional
O(n) pour.

---

## Pattern 2: Monotonic Deque — Sliding Window Maximum

A **deque** (double-ended queue) lets you add/remove at both ends. To find the maximum of every
window of size `k`, keep a deque of **indices** whose values are decreasing — the front is always
the current window's max.

```java
// dsa.queue.SlidingWindowMaximum#maxOfEachWindow
Deque<Integer> indices = new ArrayDeque<>();
for (int i = 0; i < nums.length; i++) {
    if (!indices.isEmpty() && indices.peekFirst() <= i - k) indices.pollFirst(); // slid out
    while (!indices.isEmpty() && nums[indices.peekLast()] < nums[i]) indices.pollLast(); // smaller
    indices.offerLast(i);
    if (i >= k - 1) result[i - k + 1] = nums[indices.peekFirst()];
}
```

```text
Time: O(n)   Space: O(k)
```

Each index is added and removed at most once → O(n), the same amortized argument as the monotonic
stack in lesson 05.

---

## Complexity Summary

| Task | Time | Space | Idea |
|---|---:|---:|---|
| enqueue / dequeue / peek | `O(1)` | `O(1)` | circular buffer or linked nodes |
| Queue from two stacks | `O(1)` amortized | `O(n)` | reverse on transfer |
| Sliding window maximum | `O(n)` | `O(k)` | monotonic deque |
| BFS (lessons 11, 13) | `O(V + E)` | `O(V)` | queue of frontier nodes |

---

## For Experienced Devs

**Use `ArrayDeque`, not `LinkedList`, as your queue/deque.** `Deque<T> q = new ArrayDeque<>();`
then `offer`/`poll`/`peek` (queue) or `push`/`pop` (stack). It's a growable circular array — no
per-node allocation, great locality. `LinkedList` also implements `Deque` but allocates a node per
element and trashes the cache.

**Avoid the legacy `java.util.Queue` traps.** `Queue.add`/`remove`/`element` *throw* on
empty/full; `offer`/`poll`/`peek` *return special values* (`false`/`null`). Pick the
return-value methods for normal flow and reserve the throwing ones for "this should never be
empty" invariants. (`ArrayDeque` forbids `null` elements, which is why `poll` returning `null`
unambiguously means "empty".)

**Concurrency & blocking.** Single-threaded → `ArrayDeque`. Producer/consumer across threads →
`java.util.concurrent`: `ConcurrentLinkedQueue` (non-blocking), `LinkedBlockingQueue` /
`ArrayBlockingQueue` (block when empty/full — the backbone of thread-pool work queues), or
`PriorityQueue` (a heap, not FIFO — orders by priority, O(log n) ops).

---

## Interview & Backend Notes

**Pattern triggers:**

- "process in arrival order", "level by level", "shortest path in unweighted graph" → **BFS / queue**
- "max/min of every window of size k" → **monotonic deque**
- "implement X using Y" (queue via stacks, stack via queues) → structure-conversion drill
- "first non-repeating character in a stream", "recent requests in a time window" → **queue**

**Where queues dominate backend/Spring work:**

- **Message queues**: Kafka, RabbitMQ, SQS — the entire async/event-driven architecture is FIFO
  buffering between producers and consumers.
- **Thread pools**: `ExecutorService` is backed by a `BlockingQueue` of pending tasks.
- **Rate limiting / buffering**: request queues, backpressure, bounded buffers.
- **BFS everywhere**: shortest paths, web crawling frontiers, dependency/level processing.

**`@Async`, `@Scheduled`, and Spring's `TaskExecutor` all sit on top of work queues** — knowing
the bounded-vs-unbounded queue trade-off (memory blowup vs task rejection) is a real production
concern.

---

## Practice Problems

Add each solution as a method + test under `dsa.queue`.

1. **Implement Queue using Stacks** (LeetCode 232).
2. **Number of Recent Calls** (LeetCode 933) — sliding time window with a queue.
3. **Sliding Window Maximum** (LeetCode 239) — monotonic deque.
4. **First Unique Number** (LeetCode 1429) — queue + map.
5. **Design Circular Queue** (LeetCode 622) — implement the circular buffer yourself.

---

## Quiz

### Q1

You enqueue `1, 2, 3`, dequeue once, enqueue `4`, then dequeue twice. What was returned by the
two dequeues, and what's left?

### Q2

Why is `dequeue` in `QueueUsingTwoStacks` amortized O(1) and not O(n)?

### Q3

A teammate uses `new LinkedList<>()` for a high-throughput in-memory queue. What do you suggest
and why?

---

## Answer Key

### Q1 Answer

After `enqueue 1,2,3` → front-to-back `[1,2,3]`. `dequeue` returns `1` → `[2,3]`. `enqueue 4` →
`[2,3,4]`. Two dequeues return `2` then `3`, leaving `[4]`.

### Q2 Answer

Each element is moved from the `in` stack to the `out` stack at most once over its lifetime. A
single transfer is O(n), but it only happens when `out` is empty, so the cost spreads across all
the dequeues — amortized O(1).

### Q3 Answer

Use `ArrayDeque`. It's a circular array with no per-element node allocation and far better cache
locality, so it outperforms `LinkedList` for queue workloads. For cross-thread use, reach for a
`java.util.concurrent` blocking queue instead.

---

## Next Steps

Next in the roadmap is **Hashing (HashMap / HashSet)** — the O(1)-lookup workhorse behind
deduplication, counting, and caching.

```text
Continue my DSA learning with Hashing (HashMap/HashSet) in Java with runnable code + tests, and document it in the DSA folder.
```
