package dsa.recursion;

import java.util.HashMap;
import java.util.Map;

/**
 * Fibonacci, the textbook illustration of <b>why naive recursion can be
 * catastrophic</b> and how memoization fixes it.
 *
 * <p>F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).
 */
public final class Fibonacci {

    private Fibonacci() {
    }

    /**
     * Naive recursion. Each call branches into two, recomputing the same
     * subproblems exponentially many times.
     *
     * <p>Time: O(2^n). Space: O(n) call-stack depth. Do not call with large n.
     */
    public static long naive(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        if (n <= 1) {
            return n;
        }
        return naive(n - 1) + naive(n - 2);
    }

    /**
     * Memoized recursion (top-down dynamic programming): cache each computed
     * F(n) so every subproblem is solved once. This is the bridge to lesson 14.
     *
     * <p>Time: O(n). Space: O(n) cache + O(n) call stack.
     */
    public static long memoized(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        return memoized(n, new HashMap<>());
    }

    private static long memoized(int n, Map<Integer, Long> cache) {
        if (n <= 1) {
            return n;
        }
        Long cached = cache.get(n);
        if (cached != null) {
            return cached;
        }
        long result = memoized(n - 1, cache) + memoized(n - 2, cache);
        cache.put(n, result);
        return result;
    }
}
