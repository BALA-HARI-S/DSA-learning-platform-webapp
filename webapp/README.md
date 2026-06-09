# AlgoArcade 🕹️

A game-like, interactive web app for the DSA course in this repo. Each of the 14 topics
becomes a **level** on a neon skill-tree: read a quick concept card, play a hands-on
visualizer, then beat a quiz boss to earn XP, stars, and badges. Progress is saved in your
browser (`localStorage`) — no account, no server, no internet needed.

## Run it

It's plain HTML/CSS/JS with **no build step**.

```bash
# easiest — just open the file
xdg-open webapp/index.html        # Linux
# or: open webapp/index.html      # macOS
```

Everything works from `file://` (scripts are classic, non-module). If your browser is strict
about local files, serve it statically instead:

```bash
cd webapp && python3 -m http.server 8000
# then visit http://localhost:8000
```

## How to play

1. **Map** — the 14 levels. Level 1 is open; clearing a level unlocks the next.
2. Open a level → three tabs:
   - **📖 Learn** — the core idea, key complexities, and a code snippet.
   - **🎮 Play** — an interactive visualizer (see below).
   - **⚔ Challenge** — a quiz; score **60%+** to clear the level (★ at 60/80/100%).
3. Earn **XP** (arcade levels), **stars** per topic, and **🏅 badges** for milestones.
4. Top bar: 🏅 shows your badges, ⟲ resets all progress.

## The 14 interactive visualizers

| Level | Topic | What you can play with |
|---|---|---|
| 1 | Big-O | Drag `n` on a growth chart; watch O(2ⁿ) explode past O(n²) |
| 2 | Arrays | Animated reverse, sliding-window max, two-sum (two pointers) |
| 3 | Strings | Palindrome two-pointer animation + live anagram balance table |
| 4 | Linked Lists | Build/reverse a list; find the middle with slow/fast pointers |
| 5 | Stacks | Push/pop playground + a balanced-brackets matcher game |
| 6 | Queues | Circular-buffer enqueue/dequeue with wrapping head/tail |
| 7 | Hashing | Drop keys into buckets; see collisions chain and the table resize |
| 8 | Recursion | The Fibonacci call tree — drag `n` to see the exponential blowup |
| 9 | Sorting | Race bubble/selection/insertion/merge/quick with live op counts |
| 10 | Searching | Animated binary search vs. linear scan on a sorted row |
| 11 | Trees | Pre/in/post/level-order traversals light up a sample tree |
| 12 | BST | Insert values to grow the tree; animate a search path; in-order = sorted |
| 13 | Graphs | A maze: draw walls, then watch BFS (shortest path) vs DFS pathfind |
| 14 | DP | Coin-change DP table fills bottom-up and highlights the optimal path |

## Files

```
webapp/
├── index.html        # shell (loads the scripts in order)
├── css/style.css     # neon arcade theme + animations
└── js/
    ├── util.js        # tiny DOM + animation helpers
    ├── data.js        # the 14 topics: learn content + quizzes + badges
    ├── state.js       # XP / levels / stars / badges, saved to localStorage
    ├── quiz.js        # reusable quiz "boss" engine
    ├── games.js       # the 14 interactive visualizers (Games registry)
    └── app.js         # router, skill-tree map, level view, bootstrap
```

The content mirrors the markdown lessons under [`../DSA`](../DSA) and the runnable Java in
[`../code`](../code). To extend a level, edit its entry in `data.js` (concept + quiz) and add
a `Games.<key>` function in `games.js`.

> Pure client-side and framework-free on purpose, so it runs instantly. It could later be
> served by the Spring Boot project if you want a single deployable artifact.
