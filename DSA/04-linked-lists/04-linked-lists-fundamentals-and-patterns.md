# 04 — Linked Lists: Fundamentals and Patterns

> Prerequisite: [02 — Arrays](../02-arrays/02-arrays-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/linkedlists`](../../code/src/main/java/dsa/linkedlists) ·
> tests: `cd code && mvn test -Dtest='dsa.linkedlists.*'`

## Overview

A linked list stores elements in **nodes** scattered across memory, each node holding a value
and a reference to the next node. There is no contiguous block and no index arithmetic — you
reach element `n` only by walking the chain from the head.

This is the mirror image of an array. Arrays win at random access; linked lists win at
insert/delete *once you're already at the spot*. Understanding that trade-off is the whole point
of this lesson — and pointer manipulation is a classic interview staple.

**You will learn to:**

- Build a singly linked list from scratch (the node/pointer model).
- Compare linked lists vs `ArrayList` honestly (and why the JDK's `LinkedList` is rarely the
  right choice).
- Apply the core pointer patterns: **reverse**, **slow/fast (tortoise–hare)**, **dummy-head merge**.

---

## Core Concept

### The node

```java
// dsa.linkedlists.SinglyLinkedList.Node
static final class Node<T> {
    T value;
    Node<T> next;     // reference to the next node, or null at the tail
    Node(T value) { this.value = value; }
}
```

A list is just a reference to the first node (`head`). Each node points to the next; the last
node's `next` is `null`.

```text
head → [1|·] → [2|·] → [3|·] → null
```

### Cost table — the mirror of arrays

| Operation | Linked list | Array / ArrayList |
|---|---:|---:|
| Access by index | `O(n)` (walk the chain) | `O(1)` |
| Insert/delete at head | `O(1)` | `O(n)` (shift) |
| Insert/delete at tail | `O(1)` with tail ptr | `O(1)` amortized |
| Insert/delete after a known node | `O(1)` (rewire pointers) | `O(n)` (shift) |
| Search | `O(n)` | `O(n)` |
| Memory per element | higher (node object + `next` ref) | lower (contiguous) |

The headline: **no shifting**. To delete a node you just point its predecessor's `next` past it.
But you pay for it — no O(1) random access, an extra reference per element, and poor cache
locality because nodes are scattered.

### Building one

```java
// dsa.linkedlists.SinglyLinkedList
SinglyLinkedList<Integer> list = new SinglyLinkedList<>();
list.add(1);          // append at tail — O(1) thanks to a tail pointer
list.add(2);
list.addFirst(0);     // prepend — O(1)
list.toList();        // [0, 1, 2]
```

Keeping a `tail` pointer is what makes append O(1); without it you'd walk to the end every time.

---

## Pattern 1: Reverse a List

The most-asked linked-list question. Walk the chain flipping each `next` pointer backwards.
The invariant: `prev` trails one node behind `current`, and you must stash `current.next`
*before* overwriting it.

```java
// dsa.linkedlists.LinkedListAlgorithms#reverse
Node<T> prev = null, current = head;
while (current != null) {
    Node<T> next = current.next;   // stash before rewiring
    current.next = prev;           // flip the pointer
    prev = current;
    current = next;
}
return prev;                        // new head = old tail
```

```text
Time: O(n)   Space: O(1)
```

---

## Pattern 2: Slow / Fast Pointers (Tortoise & Hare)

Two pointers moving at different speeds solve a surprising number of problems in one pass.

**Find the middle** — fast moves 2×, so when it hits the end, slow is at the middle:

```java
// dsa.linkedlists.LinkedListAlgorithms#findMiddle
Node<T> slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;     // for even length, the second of the two middles
```

**Detect a cycle (Floyd's algorithm)** — if there's a loop, fast eventually laps and meets slow:

```java
// dsa.linkedlists.LinkedListAlgorithms#hasCycle
Node<T> slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;
```

```text
Both: Time O(n)   Space O(1)
```

Why `==` and not `.equals` for the cycle check? We're comparing **node identity** (same object in
the chain), not values.

---

## Pattern 3: Dummy Head — Merge Two Sorted Lists

A **dummy (sentinel) head** node eliminates the "is the result empty yet?" special case when
building a list. Splice existing nodes together rather than allocating new ones.

```java
// dsa.linkedlists.LinkedListAlgorithms#mergeSorted
Node<T> dummy = new Node<>(null), tail = dummy;
while (a != null && b != null) {
    if (a.value.compareTo(b.value) <= 0) { tail.next = a; a = a.next; }
    else                                 { tail.next = b; b = b.next; }
    tail = tail.next;
}
tail.next = (a != null) ? a : b;    // attach whatever remains
return dummy.next;
```

```text
Time: O(n + m)   Space: O(1)
```

---

## Complexity Summary

| Operation | Time | Space |
|---|---:|---:|
| `add` (tail, with tail ptr) | `O(1)` | `O(1)` |
| `addFirst` | `O(1)` | `O(1)` |
| Access / search by value | `O(n)` | `O(1)` |
| Reverse | `O(n)` | `O(1)` |
| Find middle (slow/fast) | `O(n)` | `O(1)` |
| Detect cycle (Floyd) | `O(n)` | `O(1)` |
| Merge two sorted lists | `O(n + m)` | `O(1)` |

---

## For Experienced Devs

**The honest take on `java.util.LinkedList`.** It's a doubly linked list implementing both `List`
and `Deque`. In practice it is **almost never the right choice**: `ArrayList` beats it for nearly
all workloads due to cache locality, and `get(i)` on a `LinkedList` is `O(n)`. Its theoretical
O(1) middle insert requires you to *already hold* the node (via a `ListIterator`) — indexing to
the position is itself O(n). Modern guidance: use `ArrayList` for sequences and `ArrayDeque` for
stack/queue needs.

**`ArrayDeque` vs `LinkedList` for queues/stacks.** `ArrayDeque` is a growable circular array — no
per-element node allocation, far better locality. Prefer it for `Deque`/`Queue`/`Stack` use unless
you specifically need `LinkedList`'s null-element support or its `List` interface.

**Memory cost.** Each node is a separate heap object: the value, a `next` (and `prev` for doubly
linked) reference, plus object header padding. For a list of small values that's multiples of the
raw data size, scattered across the heap — rough on the CPU cache.

**Pointer pitfalls.** Lose the reference to `current.next` before rewiring and you've severed the
rest of the list. Off-by-one with slow/fast on even-length lists. Forgetting to null-terminate the
new tail when reversing a sublist. Draw the pointers on paper before coding.

---

## Interview & Backend Notes

**Pattern triggers:**

- "reverse the list / sublist" → **reverse with prev/current/next**
- "find middle", "nth from end", "detect a loop", "find loop start" → **slow/fast pointers**
- "merge sorted lists", "build a result list cleanly" → **dummy head**
- "remove nth node", "partition" → **two pointers with a gap / dummy head**

**Where linked structures actually appear in backend work:**

- **LRU cache**: a doubly linked list + hash map is the textbook O(1) LRU (the idea behind many
  cache libraries; `LinkedHashMap` with access-order does this for you).
- **Queues**: producer/consumer pipelines, work queues. In Java reach for `ArrayDeque` /
  `ConcurrentLinkedQueue` / `LinkedBlockingQueue` rather than rolling your own.
- **Iterators & streams**: lazy, forward-only traversal mirrors the linked-list walk.
- **Adjacency lists** for graphs (lesson 13) are arrays/lists of linked neighbors.

**Backend reality check:** you'll rarely hand-build a linked list in production Java — the JDK
gives you better tools. But the *pointer-rewiring reasoning* is exactly what you need for cache
internals, custom iterators, and a large fraction of interview questions.

---

## Practice Problems

Add each solution as a method + test under `dsa.linkedlists`.

1. **Reverse Linked List** (LeetCode 206) — you've seen it; do it again from memory.
2. **Merge Two Sorted Lists** (LeetCode 21).
3. **Linked List Cycle** (LeetCode 141) and **Cycle II** (142, find the loop start).
4. **Middle of the Linked List** (LeetCode 876).
5. **Remove Nth Node From End of List** (LeetCode 19) — two pointers with a gap + dummy head.

---

## Quiz

### Q1

You need a structure with frequent `get(i)` by index and occasional appends. `ArrayList` or
`LinkedList`? Why?

### Q2

```java
Node<T> slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```

For the list `1 → 2 → 3 → 4 → 5 → 6`, what value is `slow` pointing at when the loop ends?

### Q3

In `reverse`, what breaks if you write `current.next = prev;` **before** saving
`Node next = current.next;`?

---

## Answer Key

### Q1 Answer

`ArrayList`. Indexed `get(i)` is O(1) vs O(n) for `LinkedList`, appends are amortized O(1) for
both, and `ArrayList`'s contiguous memory is far more cache-friendly.

### Q2 Answer

`4` — the second of the two middle nodes (for even length, slow lands on the start of the second
half).

### Q3 Answer

You overwrite `current.next` before you've saved it, so you lose the reference to the rest of the
list. After the first iteration `current` can't advance — the chain is severed. Always stash
`next` first.

---

## Next Steps

You've now covered the four foundations: **complexity, arrays, strings, linked lists.** Next in
the roadmap is **Stack** (LIFO), which builds directly on arrays and linked lists.

```text
Continue my DSA learning with Stacks and document it in the DSA folder.
```
