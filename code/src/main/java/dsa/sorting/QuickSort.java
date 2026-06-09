package dsa.sorting;

/**
 * Quick sort — a <b>divide and conquer</b> sort that partitions in place.
 *
 * <p>Pick a pivot, partition the array so everything smaller is left of it and
 * everything larger is right of it (the pivot is now in its final spot), then
 * recurse on each side. Average O(n log n), but a bad pivot on already-sorted
 * data gives O(n^2) — which is why we choose a <b>randomized</b> pivot here.
 *
 * <p>In place (O(log n) stack), but <b>not stable</b>. This is the algorithm
 * behind {@code Arrays.sort(int[])} (a dual-pivot variant).
 */
public final class QuickSort {

    private static final java.util.Random RANDOM = new java.util.Random();

    private QuickSort() {
    }

    /**
     * Sorts {@code arr} ascending.
     *
     * <p>Time: O(n log n) average, O(n^2) worst case. Space: O(log n) stack.
     */
    public static void sort(int[] arr) {
        sort(arr, 0, arr.length - 1);
    }

    private static void sort(int[] arr, int low, int high) {
        if (low >= high) {
            return;
        }
        int pivotIndex = partition(arr, low, high);
        sort(arr, low, pivotIndex - 1);
        sort(arr, pivotIndex + 1, high);
    }

    /** Lomuto partition around a randomized pivot moved to the end. */
    private static int partition(int[] arr, int low, int high) {
        int randomPivot = low + RANDOM.nextInt(high - low + 1);
        swap(arr, randomPivot, high); // park the pivot at the end
        int pivot = arr[high];
        int i = low; // boundary: arr[low..i-1] are < pivot
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                swap(arr, i, j);
                i++;
            }
        }
        swap(arr, i, high); // place pivot into its final position
        return i;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
