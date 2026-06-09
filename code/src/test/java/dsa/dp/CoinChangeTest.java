package dsa.dp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class CoinChangeTest {

    @Test
    void minimumCoins() {
        assertEquals(3, CoinChange.minCoins(new int[] {1, 2, 5}, 11)); // 5+5+1
        assertEquals(2, CoinChange.minCoins(new int[] {1, 2, 5}, 6));  // 5+1
        assertEquals(0, CoinChange.minCoins(new int[] {1, 2, 5}, 0));  // no coins needed
    }

    @Test
    void greedyWouldFailButDpSucceeds() {
        // greedy picks 4+... and fails; optimal is 3+3
        assertEquals(2, CoinChange.minCoins(new int[] {1, 3, 4}, 6));
    }

    @Test
    void impossibleAmountReturnsMinusOne() {
        assertEquals(-1, CoinChange.minCoins(new int[] {2}, 3));
        assertEquals(-1, CoinChange.minCoins(new int[] {5, 10}, 3));
    }

    @Test
    void singleCoinDenomination() {
        assertEquals(5, CoinChange.minCoins(new int[] {1}, 5));
    }
}
