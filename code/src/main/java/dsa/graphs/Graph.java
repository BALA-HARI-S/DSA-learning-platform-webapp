package dsa.graphs;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

/**
 * An unweighted graph stored as an <b>adjacency list</b>: a map from each vertex
 * to the list of its neighbors. This is the standard representation for sparse
 * graphs (memory O(V + E)) and is what powers BFS and DFS below.
 *
 * <p>By default edges are undirected ({@code addEdge} links both directions); pass
 * {@code directed = true} for a one-way graph.
 *
 * <p>Vertices are integers. Neighbors are kept in insertion order so traversal
 * output is deterministic and easy to test.
 */
public class Graph {

    private final Map<Integer, List<Integer>> adjacency = new HashMap<>();
    private final boolean directed;

    public Graph() {
        this(false);
    }

    public Graph(boolean directed) {
        this.directed = directed;
    }

    /** Adds a vertex with no edges (no-op if it already exists). */
    public void addVertex(int v) {
        adjacency.computeIfAbsent(v, k -> new ArrayList<>());
    }

    /**
     * Adds an edge between {@code u} and {@code v}, creating the vertices if needed.
     * For an undirected graph the edge is added in both directions.
     */
    public void addEdge(int u, int v) {
        adjacency.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adjacency.computeIfAbsent(v, k -> new ArrayList<>());
        if (!directed) {
            adjacency.get(v).add(u);
        }
    }

    public List<Integer> neighbors(int v) {
        return adjacency.getOrDefault(v, List.of());
    }

    /**
     * Breadth-first traversal order from {@code start} (level by level). Uses a
     * queue + visited set — the canonical BFS.
     *
     * <p>Time: O(V + E). Space: O(V).
     */
    public List<Integer> bfs(int start) {
        List<Integer> order = new ArrayList<>();
        if (!adjacency.containsKey(start)) {
            return order;
        }
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);
        visited.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int neighbor : neighbors(node)) {
                if (visited.add(neighbor)) { // add returns false if already present
                    queue.offer(neighbor);
                }
            }
        }
        return order;
    }

    /**
     * Depth-first traversal order from {@code start} (recursive). Uses the call
     * stack + visited set.
     *
     * <p>Time: O(V + E). Space: O(V).
     */
    public List<Integer> dfs(int start) {
        List<Integer> order = new ArrayList<>();
        if (!adjacency.containsKey(start)) {
            return order;
        }
        dfs(start, new HashSet<>(), order);
        return order;
    }

    private void dfs(int node, Set<Integer> visited, List<Integer> order) {
        visited.add(node);
        order.add(node);
        for (int neighbor : neighbors(node)) {
            if (!visited.contains(neighbor)) {
                dfs(neighbor, visited, order);
            }
        }
    }

    /**
     * Length (in edges) of the shortest path from {@code start} to {@code target},
     * or {@code -1} if unreachable. BFS finds shortest paths in an unweighted graph
     * because it expands vertices in order of distance.
     *
     * <p>Time: O(V + E). Space: O(V).
     */
    public int shortestPathLength(int start, int target) {
        if (start == target) {
            return 0;
        }
        if (!adjacency.containsKey(start)) {
            return -1;
        }
        Set<Integer> visited = new HashSet<>();
        Queue<int[]> queue = new ArrayDeque<>(); // {vertex, distance}
        queue.offer(new int[] {start, 0});
        visited.add(start);
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            for (int neighbor : neighbors(current[0])) {
                if (neighbor == target) {
                    return current[1] + 1;
                }
                if (visited.add(neighbor)) {
                    queue.offer(new int[] {neighbor, current[1] + 1});
                }
            }
        }
        return -1;
    }
}
