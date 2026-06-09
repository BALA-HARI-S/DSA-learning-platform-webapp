package dsa.graphs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class GraphTest {

    /**
     * Undirected graph:
     *   0 - 1 - 3
     *   |   |
     *   2 - 4
     * Neighbors are kept in insertion order, so traversal output is deterministic.
     */
    private static Graph sampleUndirected() {
        Graph g = new Graph();
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(1, 4);
        g.addEdge(2, 4);
        return g;
    }

    @Test
    void bfsVisitsLevelByLevel() {
        // from 0: level0=0, level1=1,2, level2=3,4
        assertEquals(List.of(0, 1, 2, 3, 4), sampleUndirected().bfs(0));
    }

    @Test
    void dfsGoesDeepFirst() {
        // from 0: 0 -> 1 -> 3 (backtrack) -> 4 -> 2
        assertEquals(List.of(0, 1, 3, 4, 2), sampleUndirected().dfs(0));
    }

    @Test
    void shortestPathLengthUsesBfsDistance() {
        Graph g = sampleUndirected();
        assertEquals(0, g.shortestPathLength(0, 0));
        assertEquals(1, g.shortestPathLength(0, 1));
        assertEquals(2, g.shortestPathLength(0, 3)); // 0->1->3
        assertEquals(2, g.shortestPathLength(0, 4)); // 0->1->4 or 0->2->4
    }

    @Test
    void unreachableReturnsMinusOne() {
        Graph g = new Graph();
        g.addEdge(0, 1);
        g.addVertex(99); // isolated
        assertEquals(-1, g.shortestPathLength(0, 99));
        assertEquals(-1, g.shortestPathLength(0, 12345)); // not in graph
    }

    @Test
    void directedEdgesAreOneWay() {
        Graph g = new Graph(true);
        g.addEdge(0, 1);
        g.addEdge(1, 2);
        assertEquals(List.of(0, 1, 2), g.bfs(0));
        assertEquals(2, g.shortestPathLength(0, 2));
        assertEquals(-1, g.shortestPathLength(2, 0)); // cannot go backwards
    }

    @Test
    void traversalFromUnknownVertexIsEmpty() {
        Graph g = sampleUndirected();
        assertTrue(g.bfs(777).isEmpty());
        assertTrue(g.dfs(777).isEmpty());
    }
}
