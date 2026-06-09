package dsa.arrays;

/**
 * The sliding-window technique for contiguous subarray problems.
 *
 * <p>Instead of recomputing a window from scratch (which would be O(n*k)), we
 * slide a fixed- or variable-size window across the array, adjusting the running
 * aggregate by adding the element that enters and subtracting the one that leaves.
 */
public final class SlidingWindow {

    private SlidingWindow() {
    }

    /**
     * Maximum sum of any contiguous subarray of size {@code k}.
     *
     * <p>We compute the first window's sum, then slide: each step adds the new
     * right element and removes the old left element in O(1), so the whole scan
     * is linear rather than O(n*k).
     *
     * <p>Time: O(n). Space: O(1).
     *
     * @throws IllegalArgumentException if {@code k} is not in [1, nums.length]
     */
    public static int maxSumOfWindow(int[] nums, int k) {
        if (k <= 0 || k > nums.length) {
            throw new IllegalArgumentException("k must be between 1 and nums.length");
        }
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        int maxSum = windowSum;
        for (int right = k; right < nums.length; right++) {
            windowSum += nums[right] - nums[right - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
}
