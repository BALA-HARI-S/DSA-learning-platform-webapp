# 05 — Stack: Fundamentals and Patterns

> Prerequisite: [02 — Arrays](../02-arrays/02-arrays-fundamentals-and-patterns.md) and
> [04 — Linked Lists](../04-linked-lists/04-linked-lists-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/stack`](../../code/src/main/java/dsa/stack) ·
> tests: `cd code && mvn test -Dtest='dsa.stack.*'`

## Overview

A stack is a **LIFO** (last in, first out) collection: the last thing you put in is the first
thing you take out — like a stack of plates. It exposes only three core operations, all O(1):

- **push** — add to the top
- **pop** — remove and return the top
- **peek** (a.k.a. top) — look at the top without removing it

A stack is not a new memory structure — it's a *discipline* imposed on an array or linked list:
you only ever touch one end. That restriction is exactly what makes it useful for problems
involving nesting, reversal, and "most recent first" logic.

**You will learn to:**

- Implement a stack from scratch and know which JDK type to actually use.
- Recognize the LIFO problems: bracket matching, undo, expression parsing.
- Apply the **monotonic stack** pattern (next greater element).

---

## Core Concept

### LIFO in one picture

```text
push(1) push(2) push(3)        pop() -> 3     pop() -> 2
   ┌───┐                          ┌───┐          ┌───┐
   │ 3 │ ← top                    │ 2 │ ← top    │ 1 │ ← top
   │ 2 │                          │ 1 │          └───┘
   │ 1 │                          └───┘
   └───┘
```

### Building one from scratch

A stack backed by a resizing array: `push` writes at the end, `pop` reads from the end. Both
touch only the top, so both are O(1) (amortized for `push`, since an occasional resize is O(n) —
the same amortization you saw with `ArrayList` in lesson 02).

```java
// dsa.stack.ArrayStack
public void push(T value) {
    if (size == elements.length) elements = Arrays.copyOf(elements, elements.length * 2);
    elements[size++] = value;
}
public T pop() {
    if (isEmpty()) throw new NoSuchElementException("pop from empty stack");
    T value = (T) elements[--size];
    elements[size] = null;   // null it out so the popped object can be GC'd
    return value;
}
```

| Operation | Time | Space |
|---|---:|---:|
| push | `O(1)` amortized | `O(1)` amortized |
| pop | `O(1)` | `O(1)` |
| peek | `O(1)` | `O(1)` |

A linked-list-backed stack works just as well — push/pop at the head are O(1) (lesson 04). The
choice is the same array-vs-linked trade-off as before; arrays win on cache locality.

---

## Pattern 1: Balanced Brackets

The textbook stack problem. Brackets **nest**, so the most recently opened bracket must be the
first one closed — pure LIFO. Push each opener; on a closer, the top must be its matching opener.

```java
// dsa.stack.BalancedParentheses#isBalanced
Deque<Character> stack = new ArrayDeque<>();
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    switch (c) {
        case '(', '[', '{' -> stack.push(c);
        case ')' -> { if (stack.isEmpty() || stack.pop() != '(') return false; }
        case ']' -> { if (stack.isEmpty() || stack.pop() != '[') return false; }
        case '}' -> { if (stack.isEmpty() || stack.pop() != '{') return false; }
        default  -> { /* ignore */ }
    }
}
return stack.isEmpty();   // leftover openers = unbalanced
```

```text
Time: O(n)   Space: O(n)
```

Two failure modes to remember: a closer with the wrong (or no) opener on top, **and** leftover
openers at the end. The final `stack.isEmpty()` check catches the second.

---

## Pattern 2: O(1) Minimum — the Min Stack

How do you support `push`, `pop`, `top`, **and** `getMin` all in O(1)? Scanning for the min is
O(n). The trick: keep a second stack in lockstep where each entry is "the minimum at or below
this point." The current min is then always the top of that second stack.

```java
// dsa.stack.MinStack
public void push(int value) {
    values.push(value);
    mins.push(mins.isEmpty() ? value : Math.min(value, mins.peek()));
}
public int pop()    { mins.pop(); return values.pop(); }
public int getMin() { return mins.peek(); }   // O(1)
```

```text
All operations: Time O(1)   Space O(n)
```

This "carry an auxiliary stack of running aggregates" idea generalizes to max, running sums, etc.

---

## Pattern 3: Monotonic Stack — Next Greater Element

For each element, find the next element to its right that is greater. Brute force is `O(n²)`. A
**monotonic stack** holds indices that are still "waiting" for a greater neighbor; when a bigger
value arrives, it resolves all the smaller ones waiting on the stack.

```java
// dsa.stack.NextGreaterElement#nextGreater
Deque<Integer> indices = new ArrayDeque<>();   // indices awaiting an answer
for (int i = 0; i < nums.length; i++) {
    while (!indices.isEmpty() && nums[i] > nums[indices.peek()]) {
        result[indices.pop()] = nums[i];       // nums[i] is the answer for that index
    }
    indices.push(i);
}
while (!indices.isEmpty()) result[indices.pop()] = -1;   // nothing greater to the right
```

```text
Time: O(n)   Space: O(n)
```

Why is it O(n) despite the inner `while`? Each index is pushed **once** and popped **at most
once**, so the total pop work across the whole run is bounded by n. This amortized argument is the
heart of every monotonic-stack solution.

---

## Complexity Summary

| Task | Time | Space | Idea |
|---|---:|---:|---|
| push / pop / peek | `O(1)` | `O(1)` | touch one end only |
| Balanced brackets | `O(n)` | `O(n)` | LIFO nesting |
| Min stack (`getMin`) | `O(1)` | `O(n)` | auxiliary running-min stack |
| Next greater element | `O(n)` | `O(n)` | monotonic stack |

---

## For Experienced Devs

**Do not use `java.util.Stack`.** It's a legacy class (since JDK 1.0) that extends `Vector`, so
every method is `synchronized` (needless overhead) and — worse — it inherits `Vector`'s indexed
access, letting callers reach into the middle and break the LIFO contract. Its iteration order is
also bottom-to-top, which surprises people.

**Use `ArrayDeque` as your stack.** `Deque<T> stack = new ArrayDeque<>();` then `push` / `pop` /
`peek`. It's a growable circular array: no per-node allocation, great cache locality, not
synchronized. The `Deque` interface is the JDK's official recommendation for stack behavior. (One
caveat: `ArrayDeque` forbids `null` elements — use it as a feature, not a bug.)

**The call stack is a stack.** Method calls push frames; returns pop them. That's why deep/infinite
recursion throws `StackOverflowError`, and why any recursive algorithm (lesson 08) can be rewritten
iteratively with an explicit stack — useful when recursion depth would blow the call stack (e.g.
deep tree/graph traversal on large inputs).

**Concurrency.** For thread-safe LIFO use `java.util.concurrent.ConcurrentLinkedDeque` or a
`BlockingDeque`, not the old `Stack`.

---

## Interview & Backend Notes

**Pattern triggers:**

- "matching/nesting", "valid parentheses", "balanced" → **stack of openers**
- "undo/redo", "back button", "most recent first" → **LIFO stack**
- "next greater/smaller element", "largest rectangle", "daily temperatures",
  "stock span" → **monotonic stack**
- "evaluate expression", "postfix/RPN", "convert infix" → **operand/operator stacks**
- "min/max in O(1) alongside push/pop" → **auxiliary stack**

**Where stacks show up in backend/Spring work:**

- **Parsing & validation**: matching brackets/tags in JSON, XML, SQL, expression languages
  (SpEL); tokenizers and recursive-descent parsers lean on stacks.
- **Undo/history**: editor undo stacks, navigation back-stacks, transaction rollback semantics.
- **Execution model**: the JVM call stack, stack traces you read in logs, and exception
  unwinding are all this structure.
- **Iterative traversal**: replacing recursion with an explicit stack to avoid
  `StackOverflowError` when walking deep trees/graphs over large production data.

---

## Practice Problems

Add each solution as a method + test under `dsa.stack`.

1. **Valid Parentheses** (LeetCode 20) — you've seen it; redo from memory.
2. **Min Stack** (LeetCode 155).
3. **Daily Temperatures** (LeetCode 739) — monotonic stack returning distances.
4. **Evaluate Reverse Polish Notation** (LeetCode 150) — operand stack.
5. **Largest Rectangle in Histogram** (LeetCode 84) — the hard monotonic-stack classic.

---

## Quiz

### Q1

You push `1, 2, 3, 4` then call `pop()` twice. What's on top, and what does the next `peek()`
return?

### Q2

Why is `NextGreaterElement.nextGreater` O(n) and not O(n²), given it has a `while` loop nested
inside a `for` loop?

### Q3

A colleague writes `Stack<Integer> s = new java.util.Stack<>();`. Name two reasons to prefer
`Deque<Integer> s = new ArrayDeque<>();` instead.

---

## Answer Key

### Q1 Answer

After pushing `1,2,3,4` the top is `4`. Popping twice removes `4` then `3`. The next `peek()`
returns `2` (and does not remove it).

### Q2 Answer

Each index is pushed exactly once and popped at most once over the entire run, so the total number
of inner-loop iterations across all outer iterations is bounded by `n`. Amortized, the work is
`O(n)`, not `O(n²)`.

### Q3 Answer

`java.util.Stack` extends `Vector`, so (1) all operations are `synchronized` — pointless overhead
in single-threaded code, and (2) it exposes indexed/`Vector` access that lets callers violate LIFO.
`ArrayDeque` is unsynchronized, array-backed (better locality), and only exposes stack/deque
operations.

---

## Next Steps

Next in the roadmap is **Queue** (FIFO) — the mirror image of the stack, and the structure behind
BFS and most work-queue systems.

```text
Continue my DSA learning with Queues in Java with runnable code + tests, and document it in the DSA folder.
```
