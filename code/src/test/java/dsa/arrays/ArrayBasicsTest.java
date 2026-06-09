package dsa.arrays;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ArrayBasicsTest {

    @Test
    void reversesEvenLengthArray() {
        int[] arr = {1, 2, 3, 4};
        ArrayBasics.reverseInPlace(arr);
        assertArrayEquals(new int[] {4, 3, 2, 1}, arr);
    }

    @Test
    void reversesOddLengthArray() {
        int[] arr = {1, 2, 3, 4, 5};
        ArrayBasics.reverseInPlace(arr);
        assertArrayEquals(new int[] {5, 4, 3, 2, 1}, arr);
    }

    @Test
    void reverseHandlesEmptyAndSingleElement() {
        int[] empty = {};
        ArrayBasics.reverseInPlace(empty);
        assertArrayEquals(new int[] {}, empty);

        int[] single = {42};
        ArrayBasics.reverseInPlace(single);
        assertArrayEquals(new int[] {42}, single);
    }

    @Test
    void findsMax() {
        assertEquals(9, ArrayBasics.findMax(new int[] {3, 9, 1, 7}));
        assertEquals(-1, ArrayBasics.findMax(new int[] {-5, -1, -9}));
        assertEquals(4, ArrayBasics.findMax(new int[] {4}));
    }

    @Test
    void findMaxRejectsEmptyArray() {
        assertThrows(IllegalArgumentException.class, () -> ArrayBasics.findMax(new int[] {}));
    }
}
