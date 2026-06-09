package dsa.dp;

import java.util.Arrays;

/**
 * Coin change (minimum coins): the fewest coins from given denominations that sum
 * to {@code amount}, or -1 if impossible.
 *
 * <p>A classic 1-D DP. {@code dp[a]} = fewest coins to make amount {@code a}. To
 * make {@code a}, try each coin {@code c}: one {@code c} plus the best way to make
 * {@code a - c}. Build the table from 0 up to {@code amount}.
 *
 * <p>This is a <b>bottom-up</b> DP that reuses already-solved subproblems — the
 * same overlapping-subproblems insight as memoized Fibonacci (lesson 08).
 */
public final class CoinChange {

    private CoinChange() {
    }

    /**
     * Minimum number of coins to make {@code amount}, or {@code -1} if it cannot
     * be made from {@code coins}.
     *
     * <p>Time: O(amount × coins.length). Space: O(amount).
     */
    public static int minCoins(int[] coins, int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("amount must be non-negative");
        }
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // sentinel "infinity" (can't need more coins than amount)
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (coin <= a && dp[a - coin] + 1 < dp[a]) {
                    dp[a] = dp[a - coin] + 1;
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
