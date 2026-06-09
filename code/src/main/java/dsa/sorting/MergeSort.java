package dsa.sorting;

/**
 * Merge sort — a <b>divide and conquer</b> O(n log n) sort.
 *
 * <p>Split the array in half, sort each half recursively, then merge the two
 * sorted halves. The merge step is the heart of it: walk both halves with two
 * pointers, always taking the smaller front element.
 *
 * <p>It is <b>stable</b> and has a guaranteed O(n log n) worst case, at the cost
 * of O(n) extra space — which is exactly why Java uses a merge-sort variant
 * (TimSort) for {@code Object[]} where stability matters.
 */
public final class MergeSort {

    private MergeSort() {
    }

    /**
     * Sorts {@code arr} ascending.
     *
     * <p>Time: O(n log n) always. Space: O(n) for the temp buffer (+ O(log n) stack).
     */
    public static void sort(int[] arr) {
        if (arr.length < 2) {
            return;
        }
        sort(arr, new int[arr.length], 0, arr.length - 1);
    }

    private static void sort(int[] arr, int[] temp, int left, int right) {
        if (left >= right) {
            return;
        }
        int mid = left + (right - left) / 2; // avoids int overflow
        sort(arr, temp, left, mid);
        sort(arr, temp, mid + 1, right);
        merge(arr, temp, left, mid, right);
    }

    private static void merge(int[] arr, int[] temp, int left, int mid, int right) {
        System.arraycopy(arr, left, temp, left, right - left + 1);
        int i = left;       // pointer into left half of temp
        int j = mid + 1;    // pointer into right half of temp
        for (int k = left; k <= right; k++) {
            if (i > mid) {
                arr[k] = temp[j++];
            } else if (j > right) {
                arr[k] = temp[i++];
            } else if (temp[i] <= temp[j]) {
                arr[k] = temp[i++]; // <= keeps it stable
            } else {
                arr[k] = temp[j++];
            }
        }
    }
}
