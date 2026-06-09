package dsa.sorting;

/**
 * The three classic O(n^2) sorts. You will rarely use these in production (the
 * JDK's sort is far better — see the lesson), but implementing them builds
 * intuition for loop-invariants and the cost of swaps/comparisons.
 *
 * <p>All sort the array <b>in place</b> (O(1) extra space).
 */
public final class QuadraticSorts {

    private QuadraticSorts() {
    }

    /**
     * Bubble sort: repeatedly swap adjacent out-of-order pairs; the largest
     * element "bubbles" to the end each pass. Early-exits if a pass makes no swaps.
     *
     * <p>Time: O(n^2) worst/avg, O(n) best (already sorted). Space: O(1). Stable.
     */
    public static void bubbleSort(int[] arr) {
        for (int end = arr.length - 1; end > 0; end--) {
            boolean swapped = false;
            for (int i = 0; i < end; i++) {
                if (arr[i] > arr[i + 1]) {
                    swap(arr, i, i + 1);
                    swapped = true;
                }
            }
            if (!swapped) {
                return; // already sorted
            }
        }
    }

    /**
     * Selection sort: each pass selects the minimum of the unsorted suffix and
     * swaps it into place.
     *
     * <p>Time: O(n^2) always. Space: O(1). Not stable.
     */
    public static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            swap(arr, i, minIndex);
        }
    }

    /**
     * Insertion sort: grow a sorted prefix by inserting each next element into its
     * correct position. Excellent on small or nearly-sorted inputs.
     *
     * <p>Time: O(n^2) worst/avg, O(n) best. Space: O(1). Stable.
     */
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j]; // shift right
                j--;
            }
            arr[j + 1] = key;
        }
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
