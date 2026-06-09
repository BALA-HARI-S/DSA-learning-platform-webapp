package dsa.arrays;

/**
 * Fundamental in-place array operations.
 *
 * <p>"In-place" means we mutate the given array instead of allocating a new one,
 * so the extra space is O(1) regardless of input size.
 */
public final class ArrayBasics {

    private ArrayBasics() {
    }

    /**
     * Reverses {@code arr} in place using the two-pointer technique: one pointer
     * starts at the front, the other at the back, and they swap and walk toward
     * each other until they meet.
     *
     * <p>Time: O(n) — each element is touched once.
     * <br>Space: O(1) — only two index variables and a temp are used.
     */
    public static void reverseInPlace(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }

    /**
     * Returns the maximum value in {@code arr} with a single scan.
     *
     * <p>Time: O(n). Space: O(1).
     *
     * @throws IllegalArgumentException if the array is empty
     */
    public static int findMax(int[] arr) {
        if (arr.length == 0) {
            throw new IllegalArgumentException("array must not be empty");
        }
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
}
