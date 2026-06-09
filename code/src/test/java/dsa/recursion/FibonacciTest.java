package dsa.recursion;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class FibonacciTest {

    @Test
    void naiveMatchesKnownValues() {
        assertEquals(0, Fibonacci.naive(0));
        assertEquals(1, Fibonacci.naive(1));
        assertEquals(5, Fibonacci.naive(5));
        assertEquals(55, Fibonacci.naive(10));
    }

    @Test
    void memoizedMatchesNaiveForSmallN() {
        for (int n = 0; n <= 20; n++) {
            assertEquals(Fibonacci.naive(n), Fibonacci.memoized(n));
        }
    }

    @Test
    void memoizedHandlesLargeNQuickly() {
        // would be astronomically slow with naive recursion
        assertEquals(12586269025L, Fibonacci.memoized(50));
        assertEquals(1836311903L, Fibonacci.memoized(46));
    }
}
