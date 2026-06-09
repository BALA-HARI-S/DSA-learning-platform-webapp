# 03 — Strings: Fundamentals and Patterns

> Prerequisite: [02 — Arrays](../02-arrays/02-arrays-fundamentals-and-patterns.md)
> Runnable code: [`code/src/main/java/dsa/strings`](../../code/src/main/java/dsa/strings) ·
> tests: `cd code && mvn test -Dtest='dsa.strings.*'`

## Overview

A string is, conceptually, an array of characters. In Java a `String` is backed by a
character sequence and — crucially — it is **immutable**: once created it can never change.
Almost every string gotcha, performance trap, and interview pattern traces back to that one
fact.

Strings reuse everything from the arrays lesson (two pointers, sliding window, hashing for
counts), so think of this as "arrays, applied to text."

**You will learn to:**

- Understand string immutability and why it matters for performance.
- Use `StringBuilder` correctly and know when `+` is a bug.
- Apply two-pointer, frequency-counting, and sliding-window patterns to text.

---

## Core Concept

### Immutability

```java
String s = "hello";
s.toUpperCase();          // returns a NEW string; s is still "hello"
s = s.toUpperCase();      // now s points at the new "HELLO"
```

Every "modifying" method (`substring`, `replace`, `trim`, `concat`, `+`) returns a brand-new
`String`. The original is untouched. Immutability buys safety (strings can be shared freely,
used as map keys, cached) but means careless building is expensive.

### The `+=`-in-a-loop trap

```java
// dsa.strings.StringBasics#concatInLoopBad  — ANTI-PATTERN
String result = "";
for (char c : chars) {
    result += c;          // allocates a whole new string each iteration
}
```

Each `+=` copies the entire string built so far. Building an `n`-character string this way is
`O(n²)`. The fix is a `StringBuilder`, a mutable char buffer with amortized-`O(1)` append:

```java
// dsa.strings.StringBasics#buildWithStringBuilder
StringBuilder sb = new StringBuilder();
for (char c : chars) sb.append(c);   // O(n) total
return sb.toString();
```

```text
+= loop:        O(n²) time
StringBuilder:  O(n)  time
```

### Working with characters

```java
char c = s.charAt(i);     // O(1) read
char[] chars = s.toCharArray();   // O(n), gives you a mutable copy
int len = s.length();     // method, not a field
```

To "edit" a string you typically copy it to a `char[]`, mutate that, and build a new string.

---

## Pattern 1: Two Pointers — Palindrome

A palindrome reads the same forwards and backwards. Compare from both ends inward; stop at
the first mismatch.

```java
// dsa.strings.Palindrome#isPalindrome
int left = 0, right = s.length() - 1;
while (left < right) {
    if (s.charAt(left) != s.charAt(right)) return false;
    left++;
    right--;
}
return true;
```

```text
Time: O(n)   Space: O(1)   (index into the string, no copy)
```

---

## Pattern 2: Frequency Counting — Anagrams

Two strings are anagrams if they hold the same characters with the same counts. Sorting both
and comparing is `O(n log n)`; counting is `O(n)`.

```java
// dsa.strings.Anagram#areAnagrams
if (a.length() != b.length()) return false;
Map<Character, Integer> counts = new HashMap<>();
for (int i = 0; i < a.length(); i++) counts.merge(a.charAt(i), 1, Integer::sum);
for (int i = 0; i < b.length(); i++) {
    Integer c = counts.get(b.charAt(i));
    if (c == null || c == 0) return false;
    counts.put(b.charAt(i), c - 1);
}
return true;
```

```text
Time: O(n)   Space: O(k)   (k = distinct chars; O(1) for a fixed alphabet)
```

For a known small alphabet (e.g. lowercase a–z) you can swap the map for an `int[26]`, which is
faster and still `O(1)` space.

---

## Pattern 3: Sliding Window — Longest Substring Without Repeats

Find the length of the longest substring with all-unique characters. Expand the window to the
right; when a repeat enters, jump the left edge past the previous occurrence.

```java
// dsa.strings.LongestUniqueSubstring#lengthOfLongest
Map<Character, Integer> lastSeen = new HashMap<>();
int longest = 0, left = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    Integer prev = lastSeen.get(c);
    if (prev != null && prev >= left) left = prev + 1;   // shrink window
    lastSeen.put(c, right);
    longest = Math.max(longest, right - left + 1);
}
return longest;
```

```text
Time: O(n)   Space: O(k)
```

The subtle bug to avoid: only move `left` forward when the repeat is **inside** the current
window (`prev >= left`) — otherwise an old occurrence drags `left` backwards. The test
`tmmzuxt → 5` guards exactly this.

---

## Complexity Summary

| Task | Time | Space | Pattern |
|---|---:|---:|---|
| `charAt(i)` | `O(1)` | `O(1)` | direct access |
| Build with `StringBuilder` | `O(n)` | `O(n)` | mutable buffer |
| Build with `+=` in loop | `O(n²)` | `O(n)` | ⚠️ anti-pattern |
| Reverse | `O(n)` | `O(n)` | two pointers on char[] |
| Palindrome check | `O(n)` | `O(1)` | two pointers |
| Anagram check | `O(n)` | `O(k)` | frequency count |
| Longest unique substring | `O(n)` | `O(k)` | sliding window |

---

## For Experienced Devs

**`equals` vs `==`.** `==` compares references; `equals` compares contents. `"a" == "a"` happens
to be `true` because string **literals** are interned into a shared pool — but `new String("a")
== "a"` is `false`. Always compare string content with `.equals` (or `Objects.equals` for
null-safety). `intern()` forces a string into the pool; rarely needed and easy to misuse.

**Immutability ⇒ safe sharing.** Because strings can't change, they're safe as `HashMap` keys
(hashCode is cached on first use), safe to share across threads, and the JVM can deduplicate
identical literals. The cost is allocation churn — every transformation makes garbage.

**`StringBuilder` vs `StringBuffer`.** Same API; `StringBuffer` is synchronized (legacy, slower),
`StringBuilder` is not. Use `StringBuilder` unless you genuinely share the builder across threads
(you almost never should). Presize it (`new StringBuilder(expectedLen)`) to skip internal regrows.

**Encoding reality.** A Java `char` is a UTF-16 code unit, not a full Unicode code point. Emoji
and some CJK characters are *surrogate pairs* (two chars). `length()` counts code units, not
visible characters. For correct per-character work over the full range, use `codePoints()`.
Compact Strings (JDK 9+) store Latin-1 text as `byte[]` internally to save memory.

---

## Interview & Backend Notes

**Pattern triggers:**

- "reverse", "palindrome", "compare from both ends" → **two pointers**
- "anagram", "permutation", "same characters", "count of each" → **frequency map / `int[26]`**
- "longest/shortest substring", "without repeating", "at most k distinct" → **sliding window**

**Where strings dominate backend/Spring work:**

- **Request handling**: parsing path variables, query params, headers, JSON/CSV payloads.
- **Validation**: regex and char-level checks on user input (emails, tokens, formats).
- **Building output**: assembling SQL, log lines, CSV rows, templated messages — *always* with
  `StringBuilder` or a templating API, never `+=` in a loop.
- **Performance**: the `+=`-in-loop trap is one of the most common real perf bugs in business
  code that builds large reports or exports.

**Backend tip:** prefer `String.format`/text blocks for readability, `StringBuilder` for hot
loops, and a real templating engine for anything user-facing.

---

## Practice Problems

Add each solution as a method + test under `dsa.strings`.

1. **Valid Anagram** (LeetCode 242) — you've seen the core; try the `int[26]` variant.
2. **Valid Palindrome** (LeetCode 125) — ignore non-alphanumerics and case.
3. **Longest Substring Without Repeating Characters** (LeetCode 3).
4. **First Unique Character in a String** (LeetCode 387) — frequency map.
5. **Group Anagrams** (LeetCode 49) — sorted string or count signature as a map key.

---

## Quiz

### Q1

```java
String build(List<String> parts) {
    String out = "";
    for (String p : parts) out += p;   // n parts, each length ~L
    return out;
}
```

```text
Time (in terms of total length N)? Fix?
```

### Q2

```java
boolean check(String s) {
    return s.equals(new StringBuilder(s).reverse().toString());
}
```

What does this do, and what is its time/space complexity?

### Q3

```text
boolean a = "hi" == "hi";
boolean b = "hi" == new String("hi");
```

Values of `a` and `b`?

---

## Answer Key

### Q1 Answer

```text
O(N²) where N is the total output length.
```

Each `+=` recopies the accumulated string. Fix: use a `StringBuilder` → `O(N)`.

### Q2 Answer

It's a palindrome check (compare the string to its reverse).
`Time: O(n)`, `Space: O(n)` — it allocates a reversed copy. The two-pointer
`Palindrome.isPalindrome` is better at `O(1)` space.

### Q3 Answer

```text
a = true   (both are the same interned literal)
b = false  (new String allocates a distinct object; == compares references)
```

Always use `.equals` for content comparison.

---

## Next Steps

```text
Continue my DSA learning with Linked Lists and document it in the DSA folder.
```

Next lesson: [04 — Linked Lists](../04-linked-lists/04-linked-lists-fundamentals-and-patterns.md).
