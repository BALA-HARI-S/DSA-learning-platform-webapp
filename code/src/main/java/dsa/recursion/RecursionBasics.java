package dsa.recursion;

/**
 * Recursion fundamentals. Every recursive method needs two things:
 *
 * <ol>
 *   <li>a <b>base case</b> that stops the recursion, and</li>
 *   <li>a <b>recursive case</b> that makes progress toward the base case.</li>
 * </ol>
 *
 * <p>Each call adds a frame to the call stack, so recursion depth d costs O(d)
 * stack space even when no data structure is allocated.
 */
public final class RecursionBasics {

    private RecursionBasics() {
    }

    /**
     * n! = n × (n-1) × ... × 1, with 0! = 1.
     *
     * <p>Time: O(n). Space: O(n) call stack.
     *
     * @throws IllegalArgumentException for negative input
     */
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n must be non-negative");
        }
        if (n <= 1) {
            return 1; // base case
        }
        return n * factorial(n - 1); // recursive case
    }

    /**
     * Sum of 1..n.
     *
     * <p>Time: O(n). Space: O(n) call stack.
     */
    public static long sumTo(int n) {
        if (n <= 0) {
            return 0;
        }
        return n + sumTo(n - 1);
    }

    /**
     * {@code base^exp} via <b>fast exponentiation</b> (exponentiation by squaring):
     * halve the exponent each step instead of decrementing it.
     *
     * <p>Time: O(log exp). Space: O(log exp) call stack.
     *
     * @throws IllegalArgumentException for negative exponent
     */
    public static long power(long base, int exp) {
        if (exp < 0) {
            throw new IllegalArgumentException("exp must be non-negative");
        }
        if (exp == 0) {
            return 1;
        }
        long half = power(base, exp / 2);
        long halfSquared = half * half;
        return (exp % 2 == 0) ? halfSquared : base * halfSquared;
    }
}
