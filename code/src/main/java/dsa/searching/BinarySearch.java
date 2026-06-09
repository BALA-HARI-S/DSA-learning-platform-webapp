package dsa.searching;

/**
 * Binary search — the O(log n) payoff for keeping data <b>sorted</b>.
 *
 * <p>Repeatedly halve the search range: compare the middle element, then discard
 * the half that cannot contain the target. The "find the boundary" variants
 * ({@link #firstOccurrence}/{@link #lastOccurrence}) are the real interview test —
 * they keep searching after a match instead of returning immediately.
 *
 * <p>Precondition for all methods: {@code arr} is sorted ascending.
 */
public final class BinarySearch {

    private BinarySearch() {
    }

    /**
     * Returns an index of {@code target} (any, if duplicates), or {@code -1}.
     *
     * <p>Time: O(log n). Space: O(1).
     */
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2; // avoids overflow vs (low+high)/2
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    /**
     * Returns the index of the <b>first</b> occurrence of {@code target}, or -1.
     * On a match it records the position but keeps searching left.
     *
     * <p>Time: O(log n). Space: O(1).
     */
    public static int firstOccurrence(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        int result = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                result = mid;
                high = mid - 1; // keep looking left
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return result;
    }

    /**
     * Returns the index of the <b>last</b> occurrence of {@code target}, or -1.
     *
     * <p>Time: O(log n). Space: O(1).
     */
    public static int lastOccurrence(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        int result = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                result = mid;
                low = mid + 1; // keep looking right
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return result;
    }
}
