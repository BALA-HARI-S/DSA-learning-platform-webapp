package dsa.arrays;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class TwoSumTest {

    @Test
    void hashMapFindsPair() {
        assertArrayEquals(new int[] {0, 1}, TwoSum.withHashMap(new int[] {2, 7, 11, 15}, 9));
        assertArrayEquals(new int[] {1, 2}, TwoSum.withHashMap(new int[] {3, 2, 4}, 6));
    }

    @Test
    void hashMapReturnsNullWhenNoPair() {
        assertNull(TwoSum.withHashMap(new int[] {1, 2, 3}, 100));
    }

    @Test
    void bruteForceFindsPair() {
        assertArrayEquals(new int[] {0, 1}, TwoSum.bruteForce(new int[] {2, 7, 11, 15}, 9));
        assertArrayEquals(new int[] {1, 2}, TwoSum.bruteForce(new int[] {3, 2, 4}, 6));
    }

    @Test
    void bruteForceReturnsNullWhenNoPair() {
        assertNull(TwoSum.bruteForce(new int[] {1, 2, 3}, 100));
    }
}
