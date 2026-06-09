package dsa.dp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ClimbingStairsTest {

    @Test
    void smallCases() {
        assertEquals(1, ClimbingStairs.ways(0));
        assertEquals(1, ClimbingStairs.ways(1));
        assertEquals(2, ClimbingStairs.ways(2)); // 1+1, 2
        assertEquals(3, ClimbingStairs.ways(3)); // 1+1+1, 1+2, 2+1
        assertEquals(5, ClimbingStairs.ways(4));
        assertEquals(8, ClimbingStairs.ways(5));
    }

    @Test
    void followsFibonacci() {
        assertEquals(89, ClimbingStairs.ways(10));
        assertEquals(10946, ClimbingStairs.ways(20));
    }

    @Test
    void rejectsNegative() {
        assertThrows(IllegalArgumentException.class, () -> ClimbingStairs.ways(-1));
    }
}
