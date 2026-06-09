package dsa.queue;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * "Sliding window maximum": the maximum of every contiguous window of size k.
 *
 * <p>The elegant solution uses a <b>monotonic deque</b> holding indices whose
 * values are in decreasing order. The front of the deque is always the index of
 * the current window's maximum. This is the deque (double-ended queue) earning
 * its keep — we add at the back and evict from both ends.
 */
public final class SlidingWindowMaximum {

    private SlidingWindowMaximum() {
    }

    /**
     * Returns an array of the maximums of each window of size {@code k}.
     *
     * <p>Indices leave the front when they fall out of the window; indices leave
     * the back when a larger value arrives (they can never be a future max). Each
     * index is added and removed at most once → O(n).
     *
     * <p>Time: O(n). Space: O(k) for the deque.
     *
     * @throws IllegalArgumentException if k is not in [1, nums.length]
     */
    public static int[] maxOfEachWindow(int[] nums, int k) {
        if (k <= 0 || k > nums.length) {
            throw new IllegalArgumentException("k must be between 1 and nums.length");
        }
        int[] result = new int[nums.length - k + 1];
        Deque<Integer> indices = new ArrayDeque<>(); // decreasing values, front = max
        for (int i = 0; i < nums.length; i++) {
            // drop indices that have slid out of the window
            if (!indices.isEmpty() && indices.peekFirst() <= i - k) {
                indices.pollFirst();
            }
            // drop smaller values at the back — they can't be the max anymore
            while (!indices.isEmpty() && nums[indices.peekLast()] < nums[i]) {
                indices.pollLast();
            }
            indices.offerLast(i);
            if (i >= k - 1) {
                result[i - k + 1] = nums[indices.peekFirst()];
            }
        }
        return result;
    }
}
