package dsa.arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class PrefixSumTest {

    @Test
    void answersRangeQueries() {
        PrefixSum ps = new PrefixSum(new int[] {1, 2, 3, 4, 5});
        assertEquals(15, ps.rangeSum(0, 4)); // whole array
        assertEquals(9, ps.rangeSum(1, 3));  // 2 + 3 + 4
        assertEquals(3, ps.rangeSum(2, 2));  // single element
        assertEquals(1, ps.rangeSum(0, 0));
    }

    @Test
    void handlesNegativeNumbers() {
        PrefixSum ps = new PrefixSum(new int[] {-2, 5, -1, 3});
        assertEquals(5, ps.rangeSum(0, 3));
        assertEquals(4, ps.rangeSum(1, 2));
    }

    @Test
    void rejectsInvalidRange() {
        PrefixSum ps = new PrefixSum(new int[] {1, 2, 3});
        assertThrows(IndexOutOfBoundsException.class, () -> ps.rangeSum(-1, 2));
        assertThrows(IndexOutOfBoundsException.class, () -> ps.rangeSum(0, 3));
        assertThrows(IndexOutOfBoundsException.class, () -> ps.rangeSum(2, 1));
    }
}
