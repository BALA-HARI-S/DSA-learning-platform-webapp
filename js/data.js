/* ===== AlgoArcade: course content (14 topics) ===== */
/* Each topic: learn content + a quiz "boss". The `play` key selects an interactive game. */

var TOPICS = [
  {
    id: 'complexity', n: 1, name: 'Big-O Basics', icon: '⏱️', color: '#2ce6e6',
    tag: 'How work grows with n', play: 'complexity',
    lesson: 'DSA/01-foundations/01-time-and-space-complexity-java-examples.md',
    notes: [
      'Big-O is about the shape of growth, not a stopwatch. Two O(n) algorithms can differ 10× in real speed — Big-O only tells you how cost scales as n gets large, which is what dominates eventually.',
      'Watch for hidden costs: calling list.contains() (O(n)) inside a loop is secretly O(n²); building a String with += in a loop is O(n²); a copy or substring inside a loop adds a factor of n.',
    ],
    references: [
      { title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/', kind: 'reference' },
      { title: 'Asymptotic Analysis — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/', kind: 'reference' },
      { title: 'VisuAlgo — visualize algorithms', url: 'https://visualgo.net/en', kind: 'interactive' },
    ],
    videos: [
      { title: 'Asymptotic Notation & Big-O (Algorithms playlist)', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
      { title: 'Data Structures & Algorithms — Full Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'Complexity describes how the number of operations (time) or extra memory (space) grows as input size n grows — not actual seconds.',
      bullets: [
        'Drop constants and lower-order terms: 5n² + 100n + 20 → O(n²).',
        'Separate loops add (O(n)+O(n)=O(n)); nested loops multiply (O(n·n)=O(n²)).',
        'Halving the input each step → O(log n). Branching recursion → often O(2ⁿ).',
        'Keep only the dominant term — it wins as n gets large.',
      ],
      complexity: [['Single statement', 'O(1)'], ['One loop', 'O(n)'], ['Nested loops', 'O(n²)'], ['Halving', 'O(log n)'], ['Efficient sort', 'O(n log n)']],
    },
    quiz: [
      { q: 'Two separate (non-nested) loops over n elements:', opts: ['O(n²)', 'O(n)', 'O(2n) and that is final', 'O(log n)'], a: 1, explain: 'n + n = 2n, and Big-O drops the constant → O(n).' },
      { q: 'Repeatedly dividing n by 2 until it reaches 1 is:', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], a: 2, explain: 'Halving gives a logarithmic number of steps — the basis of binary search.' },
      { q: 'T(n) = 5n² + 100n + 20 simplifies to:', opts: ['O(n²)', 'O(5n²)', 'O(100n)', 'O(n)'], a: 0, explain: 'Drop constants and lower-order terms; n² dominates.' },
      { q: 'A loop nested inside another loop, both over n:', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2n)'], a: 2, explain: 'Nested loops multiply: n × n = n².' },
    ],
  },
  {
    id: 'arrays', n: 2, name: 'Arrays', icon: '▦', color: '#7cff5b',
    tag: 'Two pointers & windows', play: 'array',
    lesson: 'DSA/02-arrays/02-arrays-fundamentals-and-patterns.md',
    notes: [
      'The one superpower is O(1) random access from contiguous memory; the one weakness is O(n) insert/delete in the middle (everything shifts). Reach for arrays when you read by index far more than you reshuffle.',
      'Most array interview tricks are one of three: two pointers (sorted / partition / reverse), sliding window (contiguous subarray), or a hash map to replace an inner lookup loop.',
    ],
    references: [
      { title: 'Array Data Structure — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/array-data-structure/', kind: 'reference' },
      { title: 'Two Pointers — LeetCode tag', url: 'https://leetcode.com/tag/two-pointers/', kind: 'practice' },
      { title: 'java.util.ArrayList (Java 21 docs)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Arrays & Dynamic Arrays', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=arrays' },
      { title: 'Data Structures — Full Course (arrays section)', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'A contiguous block giving O(1) random access. Fast to read anywhere, slow to insert/delete in the middle (shifting).',
      bullets: [
        'Access by index: O(1). Search unsorted: O(n). Middle insert/delete: O(n).',
        'Two pointers: walk from both ends (reverse, pair sums) — O(n), O(1) space.',
        'Sliding window: keep a running aggregate of a contiguous range — O(n) not O(n·k).',
        'A HashMap can replace an inner loop, turning O(n²) into O(n) (two-sum).',
      ],
      complexity: [['Index access', 'O(1)'], ['Linear scan', 'O(n)'], ['Two pointers', 'O(n)'], ['Sliding window', 'O(n)']],
      code: 'int left = 0, right = arr.length - 1;\nwhile (left < right) {\n  swap(arr, left++, right--); // reverse in place\n}',
    },
    quiz: [
      { q: 'Accessing arr[i] by index is:', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], a: 1, explain: 'Address = base + i·size — one arithmetic step.' },
      { q: 'Best technique for "max sum of any window of size k":', opts: ['Brute force pairs', 'Sliding window', 'Binary search', 'Recursion'], a: 1, explain: 'Slide the window, adding the entering and subtracting the leaving element: O(n).' },
      { q: 'Inserting at the FRONT of an ArrayList of size n, repeated n times:', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], a: 2, explain: 'Each front insert shifts all elements (O(n)), done n times → O(n²). Prefer ArrayDeque.' },
      { q: 'Two-sum with a HashMap is:', opts: ['O(n²) time', 'O(n) time / O(n) space', 'O(1) space', 'O(log n) time'], a: 1, explain: 'One pass; ask "have I seen target - current?" in O(1) avg, storing seen values.' },
    ],
  },
  {
    id: 'strings', n: 3, name: 'Strings', icon: '✎', color: '#ffc34d',
    tag: 'Immutability & patterns', play: 'strings',
    lesson: 'DSA/03-strings/03-strings-fundamentals-and-patterns.md',
    notes: [
      'Treat a String as a read-only array of chars. Because it is immutable, build incrementally with StringBuilder, and compare content with .equals (not ==, which compares references).',
      'Char-frequency counts power anagram / permutation problems; sliding windows power "longest substring with some property" problems — both reuse the array patterns.',
    ],
    references: [
      { title: 'String Data Structure — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/string-data-structure/', kind: 'reference' },
      { title: 'String — LeetCode tag', url: 'https://leetcode.com/tag/string/', kind: 'practice' },
      { title: 'java.lang.String (Java 21 docs)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Sliding Window playlist', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=sliding%20window' },
      { title: 'Data Structures & Algorithms — Full Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'A String is an immutable char sequence. Every "edit" makes a new String — which drives the big performance traps.',
      bullets: [
        'Building with += in a loop is O(n²); use StringBuilder for O(n).',
        'Palindrome: two pointers from both ends — O(n), O(1) space.',
        'Anagram / counting: a frequency map (or int[26]) — O(n).',
        'Longest substring without repeats: sliding window — O(n).',
      ],
      complexity: [['charAt(i)', 'O(1)'], ['+= in loop', 'O(n²) ⚠'], ['StringBuilder build', 'O(n)'], ['Palindrome', 'O(n)']],
      code: 'StringBuilder sb = new StringBuilder();\nfor (char c : chars) sb.append(c); // O(n)',
    },
    quiz: [
      { q: 'Building a big string with += inside a loop is:', opts: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], a: 2, explain: 'Each += copies the whole accumulated string. Use StringBuilder → O(n).' },
      { q: 'Checking a palindrome with two pointers costs:', opts: ['O(n) time, O(1) space', 'O(n) time, O(n) space', 'O(n²)', 'O(log n)'], a: 0, explain: 'Compare ends inward; no copy needed.' },
      { q: 'Best way to test if two strings are anagrams:', opts: ['Compare lengths only', 'Frequency count', 'Reverse one', 'Binary search'], a: 1, explain: 'Count each character; equal counts ⇒ anagrams. O(n).' },
      { q: '"hi" == new String("hi") evaluates to:', opts: ['true', 'false', 'compile error', 'depends on JVM'], a: 1, explain: '== compares references; new String allocates a distinct object. Use .equals for content.' },
    ],
  },
  {
    id: 'linkedlist', n: 4, name: 'Linked Lists', icon: '⛓', color: '#9d7bff',
    tag: 'Pointers, no shifting', play: 'linkedlist',
    lesson: 'DSA/04-linked-lists/04-linked-lists-fundamentals-and-patterns.md',
    notes: [
      'Linked lists trade O(1) splicing for O(n) lookup and poor cache locality. In real Java you will almost always pick ArrayList / ArrayDeque — but the pointer-rewiring reasoning is gold for interviews and for understanding LRU caches and iterators.',
      'Three patterns cover most problems: reverse (prev/cur/next), slow & fast pointers (middle, cycle, nth-from-end), and a dummy head node to simplify edge cases.',
    ],
    references: [
      { title: 'Linked List — VisuAlgo (interactive)', url: 'https://visualgo.net/en/list', kind: 'interactive' },
      { title: 'Linked List — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', kind: 'reference' },
      { title: 'Linked List — LeetCode tag', url: 'https://leetcode.com/tag/linked-list/', kind: 'practice' },
    ],
    videos: [
      { title: 'Linked Lists (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Linked List — classic explainer', channel: 'mycodeschool', url: 'https://www.youtube.com/@mycodeschool/search?query=linked%20list' },
    ],
    learn: {
      summary: 'Nodes scattered in memory, each pointing to the next. No O(1) index access, but O(1) insert/delete once you hold the spot.',
      bullets: [
        'Access by index: O(n) (walk the chain). Insert/delete at a known node: O(1).',
        'Reverse: flip each next pointer with prev/current/next — O(n), O(1) space.',
        'Slow/fast pointers find the middle and detect cycles (Floyd) in one pass.',
        'In real Java, prefer ArrayList / ArrayDeque — LinkedList is rarely the right call.',
      ],
      complexity: [['Index access', 'O(n)'], ['Insert at head', 'O(1)'], ['Reverse', 'O(n)'], ['Find middle', 'O(n)']],
      code: 'Node prev = null, cur = head;\nwhile (cur != null) {\n  Node next = cur.next;\n  cur.next = prev; prev = cur; cur = next;\n}',
    },
    quiz: [
      { q: 'Getting the i-th element of a singly linked list is:', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], a: 2, explain: 'No random access — you must walk from the head.' },
      { q: 'To find the middle in one pass you use:', opts: ['Binary search', 'Slow/fast pointers', 'A hash map', 'Sorting'], a: 1, explain: 'Fast moves 2×; when it hits the end, slow is at the middle.' },
      { q: 'When reversing, what must you do before rewiring cur.next?', opts: ['Nothing', 'Save cur.next first', 'Delete the node', 'Sort the list'], a: 1, explain: 'Stash next or you lose the rest of the list.' },
      { q: 'For frequent get(i) by index, choose:', opts: ['LinkedList', 'ArrayList', 'They are equal', 'Neither'], a: 1, explain: 'ArrayList get(i) is O(1) and far more cache-friendly.' },
    ],
  },
  {
    id: 'stack', n: 5, name: 'Stacks', icon: '🥞', color: '#ff4fd8',
    tag: 'LIFO — last in, first out', play: 'stack',
    lesson: 'DSA/05-stack/05-stack-fundamentals-and-patterns.md',
    notes: [
      'Reach for a stack whenever the most-recent thing must be handled first: matching brackets/tags, undo, backtracking, and the call stack itself.',
      'The "monotonic stack" (kept increasing or decreasing) answers next-greater / next-smaller and histogram problems in O(n).',
    ],
    references: [
      { title: 'Stack Data Structure — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/stack-data-structure/', kind: 'reference' },
      { title: 'Stack — LeetCode tag', url: 'https://leetcode.com/tag/stack/', kind: 'practice' },
      { title: 'java.util.ArrayDeque (use as a stack)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Stack (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Stack & monotonic-stack problems', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=stack' },
    ],
    learn: {
      summary: 'Last-in, first-out. Only the top is accessible. push/pop/peek are all O(1).',
      bullets: [
        'Perfect for nesting: balanced brackets, undo, expression parsing.',
        'The monotonic-stack pattern solves "next greater element" in O(n).',
        'The JVM call stack is a stack — deep recursion overflows it.',
        'In Java use ArrayDeque as a stack, NOT the legacy java.util.Stack.',
      ],
      complexity: [['push / pop / peek', 'O(1)'], ['Balanced brackets', 'O(n)'], ['Next greater element', 'O(n)']],
      code: 'Deque<Character> st = new ArrayDeque<>();\nfor (char c : s) {\n  if (open(c)) st.push(c);\n  else if (st.isEmpty() || st.pop()!=match(c)) return false;\n}',
    },
    quiz: [
      { q: 'A stack follows which order?', opts: ['FIFO', 'LIFO', 'Sorted', 'Random'], a: 1, explain: 'Last in, first out.' },
      { q: 'Best structure to validate balanced parentheses:', opts: ['Queue', 'Stack', 'Heap', 'Hash set'], a: 1, explain: 'Push openers; each closer must match the top.' },
      { q: 'In modern Java, use a stack via:', opts: ['java.util.Stack', 'ArrayDeque', 'LinkedList only', 'PriorityQueue'], a: 1, explain: 'ArrayDeque is unsynchronized and cache-friendly; Stack is legacy.' },
      { q: '"Next greater element" in O(n) uses a:', opts: ['Monotonic stack', 'Binary search', 'Two heaps', 'DP table'], a: 0, explain: 'Each index is pushed and popped at most once → O(n).' },
    ],
  },
  {
    id: 'queue', n: 6, name: 'Queues', icon: '🎟️', color: '#2ce6e6',
    tag: 'FIFO — first in, first out', play: 'queue',
    lesson: 'DSA/06-queue/06-queue-fundamentals-and-patterns.md',
    notes: [
      'A queue is the engine of BFS and of every work/task pipeline. A circular buffer keeps both ends O(1) (no shifting).',
      'A deque (double-ended queue, ArrayDeque) generalizes both stack and queue and powers sliding-window-maximum.',
    ],
    references: [
      { title: 'Queue Data Structure — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/queue-data-structure/', kind: 'reference' },
      { title: 'Queue — LeetCode tag', url: 'https://leetcode.com/tag/queue/', kind: 'practice' },
      { title: 'java.util.ArrayDeque (Java 21 docs)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Queue (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Data Structures & Algorithms — Full Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'First-in, first-out. Add at the back, remove from the front. The engine behind BFS and work queues.',
      bullets: [
        'A circular buffer keeps enqueue/dequeue O(1) (no shifting).',
        'A deque adds/removes at both ends — powers sliding-window maximum.',
        'BFS uses a queue to explore level by level.',
        'Use ArrayDeque; for threads use the java.util.concurrent blocking queues.',
      ],
      complexity: [['enqueue / dequeue', 'O(1)'], ['Sliding window max', 'O(n)'], ['BFS', 'O(V + E)']],
    },
    quiz: [
      { q: 'A queue follows which order?', opts: ['LIFO', 'FIFO', 'Sorted', 'Random'], a: 1, explain: 'First in, first out.' },
      { q: 'Why a circular buffer for an array queue?', opts: ['Saves memory', 'Avoids O(n) shifting on dequeue', 'Sorts items', 'Allows duplicates'], a: 1, explain: 'head/tail wrap with modulo, so neither end shifts → O(1).' },
      { q: 'Which traversal uses a queue?', opts: ['DFS', 'BFS', 'In-order', 'Binary search'], a: 1, explain: 'BFS processes nodes in arrival order, level by level.' },
      { q: 'Sliding-window maximum is solved with a:', opts: ['Monotonic deque', 'Stack of values', 'Binary heap only', 'Two pointers alone'], a: 0, explain: 'A decreasing deque of indices keeps the window max at the front.' },
    ],
  },
  {
    id: 'hashing', n: 7, name: 'Hashing', icon: '#️⃣', color: '#7cff5b',
    tag: 'O(1) average lookup', play: 'hashing',
    lesson: 'DSA/07-hashing/07-hashing-fundamentals-and-patterns.md',
    notes: [
      'Hashing is the "have I seen this?" / "what maps to this key?" superpower at average O(1). It trades memory for speed and gives up ordering.',
      'Correctness rule: if you override equals you MUST override hashCode, and keys should be effectively immutable — otherwise entries seem to vanish from the map.',
    ],
    references: [
      { title: 'Hash Table — VisuAlgo (interactive)', url: 'https://visualgo.net/en/hashtable', kind: 'interactive' },
      { title: 'Hashing — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/hashing-data-structure/', kind: 'reference' },
      { title: 'java.util.HashMap (Java 21 docs)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Hash Tables (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Hash map interview patterns', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=hash%20map' },
    ],
    learn: {
      summary: 'Map a key to a bucket via a hash function for average O(1) put/get. Collisions chain in a bucket; a high load factor triggers resize.',
      bullets: [
        'put/get/contains: O(1) average, O(n) worst case (all keys collide).',
        'Load factor = entries / buckets; exceed it (0.75 in the JDK) → double + rehash.',
        'equal objects MUST have equal hashCode — override both together.',
        'HashMap is unordered; TreeMap is sorted (O(log n)); LinkedHashMap keeps order.',
      ],
      complexity: [['put / get', 'O(1) avg'], ['Worst case', 'O(n)'], ['Frequency count', 'O(n)']],
    },
    quiz: [
      { q: 'Average time for HashMap get/put:', opts: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], a: 1, explain: 'Hash to a bucket, scan a short chain.' },
      { q: 'If you override equals but NOT hashCode, lookups:', opts: ['Work fine', 'Often fail to find the entry', 'Throw an exception', 'Become O(log n)'], a: 1, explain: 'Different bucket on lookup than on insert — the entry seems to vanish.' },
      { q: 'Exceeding the load factor causes the map to:', opts: ['Throw', 'Resize (double + rehash)', 'Drop entries', 'Sort keys'], a: 1, explain: 'Keeps chains short so operations stay ~O(1).' },
      { q: 'Need keys in SORTED order with fast lookup? Use:', opts: ['HashMap', 'TreeMap', 'ArrayList', 'HashSet'], a: 1, explain: 'TreeMap is a red-black tree: O(log n), ordered.' },
    ],
  },
  {
    id: 'recursion', n: 8, name: 'Recursion', icon: '🌀', color: '#ffc34d',
    tag: 'A method calling itself', play: 'recursion',
    lesson: 'DSA/08-recursion/08-recursion-fundamentals-and-patterns.md',
    notes: [
      'Define the base case and make every recursive call move toward it. Each call costs a stack frame, so depth = O(extra space) and very deep recursion can StackOverflow (Java has no tail-call optimization).',
      'When a recursion recomputes the same inputs (e.g. naive Fibonacci, O(2ⁿ)), add a cache — that single step is the gateway to dynamic programming.',
    ],
    references: [
      { title: 'Recursion — VisuAlgo (interactive)', url: 'https://visualgo.net/en/recursion', kind: 'interactive' },
      { title: 'Recursion — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/recursion/', kind: 'reference' },
      { title: 'Recursion / Backtracking — LeetCode tag', url: 'https://leetcode.com/tag/backtracking/', kind: 'practice' },
    ],
    videos: [
      { title: 'Recursion & Backtracking (Algorithms playlist)', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
      { title: 'Recursion for beginners', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'Solve a problem via smaller instances of itself. Needs a base case (stops) and a recursive case (shrinks toward it).',
      bullets: [
        'Each call uses a stack frame → recursion depth d costs O(d) space.',
        'Naive Fibonacci recomputes subproblems → O(2ⁿ). Memoize → O(n).',
        'Backtracking = choose → explore → un-choose (subsets, permutations).',
        'Java has no tail-call optimization; deep recursion can StackOverflow.',
      ],
      complexity: [['factorial', 'O(n)'], ['naive Fibonacci', 'O(2ⁿ)'], ['memoized Fib', 'O(n)'], ['subsets', 'O(n·2ⁿ)']],
      code: 'long fib(int n) {\n  if (n <= 1) return n;        // base case\n  return fib(n-1) + fib(n-2);  // branches → O(2^n)\n}',
    },
    quiz: [
      { q: 'Every recursive method MUST have:', opts: ['A loop', 'A base case + a step toward it', 'An array', 'Two parameters'], a: 1, explain: 'Without a reachable base case it never terminates → StackOverflow.' },
      { q: 'Naive recursive Fibonacci is:', opts: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], a: 2, explain: 'Two branches per call, recomputing overlapping subproblems.' },
      { q: 'Memoization changes Fibonacci to:', opts: ['O(2ⁿ)', 'O(n)', 'O(n²)', 'O(1)'], a: 1, explain: 'Each subproblem is computed once and cached.' },
      { q: 'Generating all subsets/permutations uses:', opts: ['Binary search', 'Backtracking', 'Hashing', 'Sorting'], a: 1, explain: 'choose → explore → un-choose explores the decision tree.' },
    ],
  },
  {
    id: 'sorting', n: 9, name: 'Sorting', icon: '📊', color: '#9d7bff',
    tag: 'Order from chaos', play: 'sorting',
    lesson: 'DSA/09-sorting/09-sorting-fundamentals-and-patterns.md',
    notes: [
      'You will rarely hand-write a sort, but knowing them explains the library: primitives use dual-pivot quicksort, objects use stable TimSort. "Stable" matters when sorting by a secondary key.',
      'Comparison sorts cannot beat O(n log n). If you only need the top-k or a min, a heap or quickselect beats a full sort.',
    ],
    references: [
      { title: 'Sorting — VisuAlgo (interactive)', url: 'https://visualgo.net/en/sorting', kind: 'interactive' },
      { title: 'Sorting Algorithms — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sorting-algorithms/', kind: 'reference' },
      { title: 'Big-O Cheat Sheet (sorting table)', url: 'https://www.bigocheatsheet.com/', kind: 'reference' },
    ],
    videos: [
      { title: 'Sorting Algorithms (Algorithms playlist)', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
      { title: 'Data Structures & Algorithms — Full Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
    ],
    learn: {
      summary: 'Arrange elements in order. O(n²) simple sorts vs O(n log n) divide-and-conquer sorts. Comparison sorts can\'t beat Ω(n log n).',
      bullets: [
        'Bubble/selection/insertion: O(n²), in place. Insertion shines on near-sorted data.',
        'Merge sort: O(n log n) always, stable, O(n) extra space.',
        'Quick sort: O(n log n) average (O(n²) worst), in place, not stable.',
        'JDK: dual-pivot quicksort for primitives, stable TimSort for objects.',
      ],
      complexity: [['Bubble/Selection/Insertion', 'O(n²)'], ['Merge', 'O(n log n)'], ['Quick (avg)', 'O(n log n)'], ['Quick (worst)', 'O(n²)']],
    },
    quiz: [
      { q: 'Merge sort\'s worst-case time is:', opts: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], a: 1, explain: 'Always splits in half and merges in linear time.' },
      { q: 'Quick sort\'s worst case (bad pivots) is:', opts: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], a: 2, explain: 'Maximally unbalanced partitions; a random pivot avoids it in practice.' },
      { q: '"Stable" sort means:', opts: ['Never crashes', 'Equal elements keep their original order', 'Uses O(1) memory', 'Is always fastest'], a: 1, explain: 'Matters when sorting by a secondary key.' },
      { q: 'Which is great on nearly-sorted input?', opts: ['Selection sort', 'Insertion sort', 'Neither', 'Quick sort worst case'], a: 1, explain: 'Insertion sort is O(n) when the array is almost sorted.' },
    ],
  },
  {
    id: 'searching', n: 10, name: 'Searching', icon: '🔍', color: '#2ce6e6',
    tag: 'Find it fast', play: 'searching',
    lesson: 'DSA/10-searching/10-searching-fundamentals-and-patterns.md',
    notes: [
      'Binary search is the payoff for keeping data sorted: O(log n) instead of O(n). Watch the three traps — overflow in mid, the loop bound, and which duplicate you want (first vs last).',
      'The deeper skill is "binary search on the answer": when a predicate flips false→true at some threshold, you can binary-search the value space even without an array.',
    ],
    references: [
      { title: 'Searching Algorithms — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/searching-algorithms/', kind: 'reference' },
      { title: 'Binary Search — LeetCode tag', url: 'https://leetcode.com/tag/binary-search/', kind: 'practice' },
      { title: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/', kind: 'reference' },
    ],
    videos: [
      { title: 'Binary Search & Searching (Algorithms playlist)', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
      { title: 'Binary search patterns', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=binary%20search' },
    ],
    learn: {
      summary: 'Unsorted data → linear O(n) scan. Sorted data → binary search O(log n) by halving the range each step.',
      bullets: [
        'Binary search precondition: the array is sorted.',
        'Use mid = low + (high - low) / 2 to avoid integer overflow.',
        'Boundary variants find the first/last occurrence of duplicates.',
        '"Binary search on the answer" works when a predicate is monotonic.',
      ],
      complexity: [['Linear search', 'O(n)'], ['Binary search', 'O(log n)'], ['First/last occurrence', 'O(log n)']],
      code: 'int lo=0, hi=a.length-1;\nwhile (lo <= hi) {\n  int mid = lo + (hi-lo)/2;\n  if (a[mid]==x) return mid;\n  else if (a[mid]<x) lo=mid+1; else hi=mid-1;\n}',
    },
    quiz: [
      { q: 'Binary search requires the data to be:', opts: ['Hashed', 'Sorted', 'Reversed', 'Unique'], a: 1, explain: 'It relies on discarding the half that can\'t contain the target.' },
      { q: 'Searching 1,000,000 sorted items with binary search takes ~:', opts: ['1,000,000 steps', '~20 steps', '~1000 steps', '500,000 steps'], a: 1, explain: 'log₂(10⁶) ≈ 20.' },
      { q: 'Why mid = low + (high-low)/2 instead of (low+high)/2?', opts: ['Faster', 'Avoids integer overflow', 'Sorts faster', 'No reason'], a: 1, explain: '(low+high) can overflow int for large indices.' },
      { q: 'On UNSORTED data the best search is:', opts: ['Binary search', 'Linear search', 'Jump search', 'Interpolation'], a: 1, explain: 'Without order you must scan — O(n).' },
    ],
  },
  {
    id: 'trees', n: 11, name: 'Trees', icon: '🌳', color: '#7cff5b',
    tag: 'Hierarchies & traversals', play: 'trees',
    lesson: 'DSA/11-trees/11-trees-fundamentals-and-patterns.md',
    notes: [
      'A tree is defined recursively, so most tree code is a few lines of recursion. Pick the traversal for the job: in-order = sorted (for a BST), post-order = compute-from-children, level-order (BFS) = by depth.',
      'Tree height drives both cost and recursion depth; a skewed tree degrades to a list. Real ordered structures stay balanced (red-black).',
    ],
    references: [
      { title: 'Binary Tree — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', kind: 'reference' },
      { title: 'Tree traversal — VisuAlgo (interactive)', url: 'https://visualgo.net/en/bst', kind: 'interactive' },
      { title: 'Tree — LeetCode tag', url: 'https://leetcode.com/tag/tree/', kind: 'practice' },
    ],
    videos: [
      { title: 'Trees (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Tree traversals & problems', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=binary%20tree' },
    ],
    learn: {
      summary: 'Nodes with up to two children, defined recursively. Traversed depth-first (pre/in/post) or breadth-first (level-order).',
      bullets: [
        'Pre-order: Node, L, R. In-order: L, Node, R. Post-order: L, R, Node.',
        'In-order of a BST yields sorted values.',
        'Level-order (BFS) uses a queue; DFS uses recursion / a stack.',
        'All traversals are O(n); DFS depth = tree height.',
      ],
      complexity: [['Any traversal', 'O(n)'], ['DFS space', 'O(h)'], ['BFS space', 'O(w)']],
    },
    quiz: [
      { q: 'Which DFS traversal gives sorted order for a BST?', opts: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], a: 1, explain: 'Left, Node, Right visits smaller values first.' },
      { q: 'Level-order traversal uses a:', opts: ['Stack', 'Queue', 'Heap', 'Hash map'], a: 1, explain: 'It processes nodes level by level (BFS).' },
      { q: 'Time to visit every node once is:', opts: ['O(log n)', 'O(n)', 'O(n²)', 'O(h)'], a: 1, explain: 'Each node is touched exactly once.' },
      { q: 'To compute a value depending on children (e.g. height), use:', opts: ['Pre-order', 'Post-order', 'Level-order', 'Binary search'], a: 1, explain: 'Post-order visits children before the parent.' },
    ],
  },
  {
    id: 'bst', n: 12, name: 'Binary Search Trees', icon: '🔺', color: '#ff4fd8',
    tag: 'Ordered, searchable tree', play: 'bst',
    lesson: 'DSA/12-bst/12-bst-fundamentals-and-patterns.md',
    notes: [
      'The left<node<right invariant turns a tree into binary search with O(log n) insert/delete too — but only while balanced. Inserting sorted data into a plain BST degenerates it to O(n).',
      'In production use TreeMap / TreeSet (self-balancing). Reach for them over a HashMap when you need ordered iteration or floor / ceiling / range queries.',
    ],
    references: [
      { title: 'BST — VisuAlgo (interactive)', url: 'https://visualgo.net/en/bst', kind: 'interactive' },
      { title: 'Binary Search Tree — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/', kind: 'reference' },
      { title: 'java.util.TreeMap (Java 21 docs)', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html', kind: 'docs' },
    ],
    videos: [
      { title: 'Binary Search Trees (Data Structures playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'BST insert / delete / search', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=binary%20search%20tree' },
    ],
    learn: {
      summary: 'A binary tree where left subtree < node < right subtree. Search/insert/delete are O(h) — O(log n) when balanced.',
      bullets: [
        'At each node, go left (smaller) or right (larger) — discard half the tree.',
        'Inserting sorted data into a plain BST degenerates it into a list (O(n)).',
        'Delete has three cases: leaf, one child, two children (use in-order successor).',
        'Production code uses self-balancing trees: TreeMap/TreeSet (red-black).',
      ],
      complexity: [['search/insert (balanced)', 'O(log n)'], ['search/insert (degenerate)', 'O(n)'], ['in-order dump', 'O(n)']],
    },
    quiz: [
      { q: 'The BST invariant says, for each node:', opts: ['left > node > right', 'left < node < right', 'all children equal', 'children are sorted lists'], a: 1, explain: 'Smaller on the left, larger on the right — recursively.' },
      { q: 'Inserting 1,2,3,4,5 in order into a plain BST gives:', opts: ['A balanced tree', 'A list-like tree (O(n))', 'A full tree', 'An error'], a: 1, explain: 'It degenerates into a right-leaning chain — why we use balanced trees.' },
      { q: 'Deleting a node with two children: replace it with its:', opts: ['Parent', 'In-order successor', 'Root', 'Left child always'], a: 1, explain: 'The smallest value in the right subtree preserves the invariant.' },
      { q: 'Production-grade ordered map in Java:', opts: ['HashMap', 'TreeMap', 'ArrayList', 'A hand-rolled BST'], a: 1, explain: 'TreeMap is a self-balancing red-black tree, guaranteed O(log n).' },
    ],
  },
  {
    id: 'graphs', n: 13, name: 'Graphs', icon: '🕸️', color: '#9d7bff',
    tag: 'Vertices & edges', play: 'graphs',
    lesson: 'DSA/13-graphs/13-graphs-fundamentals-and-patterns.md',
    notes: [
      'Graphs are the general case — trees are just acyclic graphs. Adjacency lists (O(V+E) memory) are the default. The visited set is mandatory or cycles loop forever.',
      'BFS = shortest path in an UNWEIGHTED graph and level-by-level work; DFS = reachability, cycle detection, topological sort. Weighted shortest path needs Dijkstra.',
    ],
    references: [
      { title: 'Graph traversal — VisuAlgo (interactive)', url: 'https://visualgo.net/en/graphds', kind: 'interactive' },
      { title: 'Graph Data Structure — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', kind: 'reference' },
      { title: 'Graph — LeetCode tag', url: 'https://leetcode.com/tag/graph/', kind: 'practice' },
    ],
    videos: [
      { title: 'Graph Theory (Algorithms playlist)', channel: 'William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu' },
      { title: 'Graphs (BFS/DFS) — Algorithms playlist', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
    ],
    learn: {
      summary: 'Vertices connected by edges (directed/undirected, weighted/not). Traversed with BFS or DFS plus a visited set.',
      bullets: [
        'Adjacency list: O(V+E) memory — the default for sparse graphs.',
        'BFS finds shortest paths in an UNWEIGHTED graph (explores by distance).',
        'DFS: reachability, cycle detection, topological sort.',
        'A visited set is mandatory — cycles make traversal loop forever otherwise.',
      ],
      complexity: [['BFS / DFS', 'O(V + E)'], ['Adjacency list memory', 'O(V + E)'], ['Adjacency matrix memory', 'O(V²)']],
    },
    quiz: [
      { q: 'BFS finds shortest paths when the graph is:', opts: ['Weighted', 'Unweighted', 'Directed only', 'A tree only'], a: 1, explain: 'It expands vertices in order of hop-distance from the start.' },
      { q: 'Forgetting the visited set on a cyclic graph causes:', opts: ['Wrong sort', 'Infinite loop', 'O(1) speedup', 'Nothing'], a: 1, explain: 'The cycle re-adds seen vertices forever.' },
      { q: 'Ordering modules by dependency uses:', opts: ['Binary search', 'Topological sort', 'BFS shortest path', 'Hashing'], a: 1, explain: 'A DAG\'s topological order lists dependencies before dependents.' },
      { q: 'Time for BFS/DFS over a graph:', opts: ['O(V²)', 'O(V + E)', 'O(E²)', 'O(log V)'], a: 1, explain: 'Each vertex and edge is processed once.' },
    ],
  },
  {
    id: 'dp', n: 14, name: 'Dynamic Programming', icon: '🧩', color: '#ffc34d',
    tag: 'Reuse subproblem answers', play: 'dp',
    lesson: 'DSA/14-dynamic-programming/14-dynamic-programming-fundamentals-and-patterns.md',
    notes: [
      'DP applies when subproblems overlap and the optimum is built from sub-optima. The hard part is defining the state and recurrence — the code is short once you have them.',
      'Top-down = recursion + cache (memoization); bottom-up = fill a table. Greedy is simpler but can be wrong (coin change {1,3,4}, amount 6).',
    ],
    references: [
      { title: 'Dynamic Programming — GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dynamic-programming/', kind: 'reference' },
      { title: 'DP — LeetCode tag', url: 'https://leetcode.com/tag/dynamic-programming/', kind: 'practice' },
      { title: 'NeetCode roadmap (DP section)', url: 'https://neetcode.io/roadmap', kind: 'reference' },
    ],
    videos: [
      { title: 'Dynamic Programming (Algorithms playlist)', channel: 'Abdul Bari', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O' },
      { title: 'DP for beginners + patterns', channel: 'NeetCode', url: 'https://www.youtube.com/@NeetCode/search?query=dynamic%20programming' },
    ],
    learn: {
      summary: 'Break a problem into overlapping subproblems with optimal substructure, solve each once, and reuse — top-down (memo) or bottom-up (table).',
      bullets: [
        'Applies when subproblems OVERLAP and the optimum is built from sub-optima.',
        'Define the state and recurrence — that is 80% of the work.',
        'Coin change is DP; greedy can fail (coins {1,3,4}, amount 6 → 3+3 beats 4+1+1).',
        'Climbing stairs = Fibonacci; collapse the table to O(1) space.',
      ],
      complexity: [['Climbing stairs', 'O(n)'], ['Coin change', 'O(amount·coins)'], ['0/1 knapsack', 'O(n·capacity)']],
    },
    quiz: [
      { q: 'DP applies when a problem has:', opts: ['No structure', 'Overlapping subproblems + optimal substructure', 'Only one answer', 'Random inputs'], a: 1, explain: 'Otherwise it is plain divide-and-conquer or greedy.' },
      { q: 'For coins {1,3,4} and amount 6, greedy vs DP:', opts: ['Both give 2', 'Greedy 3 coins, DP 2 coins', 'Both give 3', 'DP fails'], a: 1, explain: 'Greedy takes 4+1+1; DP finds 3+3.' },
      { q: 'Climbing stairs (1 or 2 steps) has the recurrence of:', opts: ['Factorial', 'Fibonacci', 'Binary search', 'Quicksort'], a: 1, explain: 'ways(n) = ways(n-1) + ways(n-2).' },
      { q: 'Memoization is which DP style?', opts: ['Bottom-up', 'Top-down (recurse + cache)', 'Greedy', 'Iterative only'], a: 1, explain: 'Tabulation is the bottom-up counterpart.' },
    ],
  },
];

// Badges: id, icon, name, desc, and a predicate over the saved state.
var BADGES = [
  { id: 'first', ico: '🌱', name: 'First Steps', desc: 'Clear your first level', test: (s) => completedCount(s) >= 1 },
  { id: 'five', ico: '⚡', name: 'On a Roll', desc: 'Clear 5 levels', test: (s) => completedCount(s) >= 5 },
  { id: 'half', ico: '🎯', name: 'Halfway Hero', desc: 'Clear 7 levels', test: (s) => completedCount(s) >= 7 },
  { id: 'all', ico: '👑', name: 'Grandmaster', desc: 'Clear all 14 levels', test: (s) => completedCount(s) >= 14 },
  { id: 'perfect', ico: '💎', name: 'Flawless', desc: 'Earn 3 stars on any level', test: (s) => Object.values(s.scores || {}).some((v) => v >= 100) },
  { id: 'allstar', ico: '🌟', name: 'All-Star', desc: '3 stars on every level', test: (s) => TOPICS.every((t) => (s.scores || {})[t.id] >= 100) },
  { id: 'xp500', ico: '🚀', name: 'XP Hunter', desc: 'Reach 500 XP', test: (s) => (s.xp || 0) >= 500 },
];
function completedCount(s) { return Object.keys(s.scores || {}).length; }
