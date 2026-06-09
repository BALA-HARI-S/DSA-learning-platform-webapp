package dsa.stack;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.Test;

class NextGreaterElementTest {

    @Test
    void findsNextGreater() {
        // 2 -> 5, 5 -> 25, 25 -> -1, 7 -> 8, 8 -> -1
        assertArrayEquals(new int[] {5, 25, -1, 8, -1},
                NextGreaterElement.nextGreater(new int[] {2, 5, 25, 7, 8}));
    }

    @Test
    void strictlyDecreasingHasNoGreater() {
        assertArrayEquals(new int[] {-1, -1, -1, -1},
                NextGreaterElement.nextGreater(new int[] {4, 3, 2, 1}));
    }

    @Test
    void strictlyIncreasingChainsToNeighbor() {
        assertArrayEquals(new int[] {2, 3, 4, -1},
                NextGreaterElement.nextGreater(new int[] {1, 2, 3, 4}));
    }

    @Test
    void handlesEmptyAndSingle() {
        assertArrayEquals(new int[] {}, NextGreaterElement.nextGreater(new int[] {}));
        assertArrayEquals(new int[] {-1}, NextGreaterElement.nextGreater(new int[] {42}));
    }

    @Test
    void duplicatesNeedStrictlyGreater() {
        // 2 -> -1 (no strictly greater after it), 2 -> -1
        assertArrayEquals(new int[] {-1, -1},
                NextGreaterElement.nextGreater(new int[] {2, 2}));
    }
}
