package dsa.queue;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class SlidingWindowMaximumTest {

    @Test
    void maxOfEachWindow() {
        // windows of 3 over [1,3,-1,-3,5,3,6,7]: 3,3,5,5,6,7
        assertArrayEquals(new int[] {3, 3, 5, 5, 6, 7},
                SlidingWindowMaximum.maxOfEachWindow(new int[] {1, 3, -1, -3, 5, 3, 6, 7}, 3));
    }

    @Test
    void windowSizeOneReturnsInput() {
        assertArrayEquals(new int[] {4, 2, 9},
                SlidingWindowMaximum.maxOfEachWindow(new int[] {4, 2, 9}, 1));
    }

    @Test
    void windowEqualsLength() {
        assertArrayEquals(new int[] {9},
                SlidingWindowMaximum.maxOfEachWindow(new int[] {4, 2, 9, 1}, 4));
    }

    @Test
    void rejectsInvalidWindow() {
        assertThrows(IllegalArgumentException.class,
                () -> SlidingWindowMaximum.maxOfEachWindow(new int[] {1, 2}, 0));
        assertThrows(IllegalArgumentException.class,
                () -> SlidingWindowMaximum.maxOfEachWindow(new int[] {1, 2}, 3));
    }
}
