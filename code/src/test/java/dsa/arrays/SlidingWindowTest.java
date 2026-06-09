package dsa.arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class SlidingWindowTest {

    @Test
    void findsMaxWindowSum() {
        // windows of size 3: [2,1,5]=8, [1,5,1]=7, [5,1,3]=9, [1,3,2]=6
        assertEquals(9, SlidingWindow.maxSumOfWindow(new int[] {2, 1, 5, 1, 3, 2}, 3));
    }

    @Test
    void windowOfSizeOneIsTheMaxElement() {
        assertEquals(5, SlidingWindow.maxSumOfWindow(new int[] {2, 1, 5, 1, 3}, 1));
    }

    @Test
    void windowEqualToArrayLengthSumsEverything() {
        assertEquals(10, SlidingWindow.maxSumOfWindow(new int[] {1, 2, 3, 4}, 4));
    }

    @Test
    void rejectsInvalidWindowSize() {
        assertThrows(IllegalArgumentException.class,
                () -> SlidingWindow.maxSumOfWindow(new int[] {1, 2, 3}, 0));
        assertThrows(IllegalArgumentException.class,
                () -> SlidingWindow.maxSumOfWindow(new int[] {1, 2, 3}, 4));
    }
}
