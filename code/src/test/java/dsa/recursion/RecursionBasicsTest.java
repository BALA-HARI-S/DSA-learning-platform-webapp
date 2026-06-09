package dsa.recursion;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class RecursionBasicsTest {

    @Test
    void factorial() {
        assertEquals(1, RecursionBasics.factorial(0));
        assertEquals(1, RecursionBasics.factorial(1));
        assertEquals(120, RecursionBasics.factorial(5));
        assertEquals(3628800, RecursionBasics.factorial(10));
    }

    @Test
    void factorialRejectsNegative() {
        assertThrows(IllegalArgumentException.class, () -> RecursionBasics.factorial(-1));
    }

    @Test
    void sumTo() {
        assertEquals(0, RecursionBasics.sumTo(0));
        assertEquals(15, RecursionBasics.sumTo(5));
        assertEquals(5050, RecursionBasics.sumTo(100));
    }

    @Test
    void power() {
        assertEquals(1, RecursionBasics.power(2, 0));
        assertEquals(2, RecursionBasics.power(2, 1));
        assertEquals(1024, RecursionBasics.power(2, 10));
        assertEquals(243, RecursionBasics.power(3, 5));
    }

    @Test
    void powerRejectsNegativeExponent() {
        assertThrows(IllegalArgumentException.class, () -> RecursionBasics.power(2, -1));
    }
}
