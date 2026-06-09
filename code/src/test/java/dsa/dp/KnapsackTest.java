package dsa.dp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class KnapsackTest {

    @Test
    void classicExample() {
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};
        // capacity 7: take items with weight 3 (val 4) and 4 (val 5) = 9
        assertEquals(9, Knapsack.maxValue(weights, values, 7));
    }

    @Test
    void capacityZeroOrNoItems() {
        assertEquals(0, Knapsack.maxValue(new int[] {1, 2}, new int[] {10, 20}, 0));
        assertEquals(0, Knapsack.maxValue(new int[] {}, new int[] {}, 10));
    }

    @Test
    void takesSingleBestItemThatFits() {
        int[] weights = {2, 3, 4};
        int[] values = {3, 4, 8};
        // capacity 4: best single item is weight 4 / value 8 (beats 3+4=7 over-capacity combos)
        assertEquals(8, Knapsack.maxValue(weights, values, 4));
    }

    @Test
    void canTakeAllWhenCapacityLarge() {
        int[] weights = {1, 2, 3};
        int[] values = {6, 10, 12};
        assertEquals(28, Knapsack.maxValue(weights, values, 100));
    }

    @Test
    void rejectsMismatchedLengths() {
        assertThrows(IllegalArgumentException.class,
                () -> Knapsack.maxValue(new int[] {1, 2}, new int[] {1}, 5));
    }
}
