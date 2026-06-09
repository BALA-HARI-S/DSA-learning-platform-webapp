package dsa.dp;

/**
 * Climbing stairs: how many distinct ways to reach step {@code n} taking 1 or 2
 * steps at a time? The gentlest introduction to dynamic programming.
 *
 * <p>The recurrence is exactly Fibonacci: {@code ways(n) = ways(n-1) + ways(n-2)},
 * because the last move was either a 1-step (from n-1) or a 2-step (from n-2).
 * Naive recursion is O(2^n); <b>tabulation</b> (bottom-up DP) makes it O(n), and
 * keeping only the last two values makes it O(1) space.
 */
public final class ClimbingStairs {

    private ClimbingStairs() {
    }

    /**
     * Number of distinct ways to climb {@code n} stairs.
     *
     * <p>Time: O(n). Space: O(1) — only the previous two results are kept.
     *
     * @throws IllegalArgumentException for negative n
     */
    public static long ways(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        if (n <= 1) {
            return 1; // 1 way to climb 0 stairs (do nothing) or 1 stair
        }
        long twoBack = 1; // ways(0)
        long oneBack = 1; // ways(1)
        for (int step = 2; step <= n; step++) {
            long current = oneBack + twoBack;
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
}
