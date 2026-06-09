package dsa.dp;

/**
 * 0/1 knapsack: given items with weights and values and a weight capacity,
 * maximize total value where each item is taken at most once (0 or 1 times).
 *
 * <p>The 2-D DP: {@code dp[i][w]} = best value using the first {@code i} items with
 * capacity {@code w}. For each item we take the better of <b>skipping</b> it
 * ({@code dp[i-1][w]}) or <b>taking</b> it ({@code value + dp[i-1][w - weight]}).
 * This "include vs exclude" choice is the heart of subset-style DP.
 */
public final class Knapsack {

    private Knapsack() {
    }

    /**
     * Maximum value achievable within {@code capacity}.
     *
     * <p>Time: O(n × capacity). Space: O(n × capacity).
     *
     * @throws IllegalArgumentException if weights and values differ in length
     */
    public static int maxValue(int[] weights, int[] values, int capacity) {
        if (weights.length != values.length) {
            throw new IllegalArgumentException("weights and values must be the same length");
        }
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            int weight = weights[i - 1];
            int value = values[i - 1];
            for (int w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w]; // skip item i
                if (weight <= w) {
                    dp[i][w] = Math.max(dp[i][w], value + dp[i - 1][w - weight]); // take item i
                }
            }
        }
        return dp[n][capacity];
    }
}
