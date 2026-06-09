package dsa.searching;

/**
 * Linear search — scan until found. Works on <b>any</b> array (sorted or not),
 * which is its whole point: when data is unsorted, O(n) is the best you can do.
 */
public final class LinearSearch {

    private LinearSearch() {
    }

    /**
     * Returns the index of the first occurrence of {@code target}, or {@code -1}.
     *
     * <p>Time: O(n) worst/avg, O(1) best. Space: O(1).
     */
    public static int indexOf(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}
