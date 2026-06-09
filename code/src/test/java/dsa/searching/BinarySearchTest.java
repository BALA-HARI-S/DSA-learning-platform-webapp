package dsa.searching;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class BinarySearchTest {

    @Test
    void findsExistingElement() {
        int[] arr = {1, 3, 5, 7, 9, 11};
        assertEquals(0, BinarySearch.search(arr, 1));
        assertEquals(5, BinarySearch.search(arr, 11));
        assertEquals(3, BinarySearch.search(arr, 7));
    }

    @Test
    void returnsMinusOneWhenAbsent() {
        int[] arr = {1, 3, 5, 7, 9};
        assertEquals(-1, BinarySearch.search(arr, 4));
        assertEquals(-1, BinarySearch.search(arr, 100));
        assertEquals(-1, BinarySearch.search(new int[] {}, 1));
    }

    @Test
    void firstOccurrenceWithDuplicates() {
        int[] arr = {1, 2, 2, 2, 3, 4};
        assertEquals(1, BinarySearch.firstOccurrence(arr, 2));
        assertEquals(0, BinarySearch.firstOccurrence(arr, 1));
        assertEquals(-1, BinarySearch.firstOccurrence(arr, 9));
    }

    @Test
    void lastOccurrenceWithDuplicates() {
        int[] arr = {1, 2, 2, 2, 3, 4};
        assertEquals(3, BinarySearch.lastOccurrence(arr, 2));
        assertEquals(5, BinarySearch.lastOccurrence(arr, 4));
        assertEquals(-1, BinarySearch.lastOccurrence(arr, 9));
    }

    @Test
    void agreesWithLinearSearchOnPresence() {
        int[] arr = {2, 4, 6, 8, 10, 12, 14};
        for (int target = 0; target <= 16; target++) {
            boolean binaryFound = BinarySearch.search(arr, target) != -1;
            boolean linearFound = LinearSearch.indexOf(arr, target) != -1;
            assertTrue(binaryFound == linearFound, "mismatch for target " + target);
        }
    }
}
