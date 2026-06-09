package dsa.stack;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * The "monotonic stack" pattern: for each element, find the next element to its
 * right that is strictly greater.
 *
 * <p>The brute force is O(n^2) — for each element, scan rightward. A stack that
 * holds indices of elements still "waiting" for a greater neighbor solves it in
 * O(n): each index is pushed and popped at most once.
 */
public final class NextGreaterElement {

    private NextGreaterElement() {
    }

    /**
     * Returns an array where {@code result[i]} is the first value to the right of
     * {@code nums[i]} that is greater than {@code nums[i]}, or {@code -1} if none.
     *
     * <p>We keep a stack of indices whose "next greater" is not yet known. When a
     * new element is larger than the value at the stacked index, it is that index's
     * answer, so we pop and fill it in.
     *
     * <p>Time: O(n) — each index is pushed and popped once. Space: O(n).
     */
    public static int[] nextGreater(int[] nums) {
        int[] result = new int[nums.length];
        Deque<Integer> indices = new ArrayDeque<>(); // indices awaiting an answer
        for (int i = 0; i < nums.length; i++) {
            while (!indices.isEmpty() && nums[i] > nums[indices.peek()]) {
                result[indices.pop()] = nums[i];
            }
            indices.push(i);
        }
        while (!indices.isEmpty()) {
            result[indices.pop()] = -1; // nothing greater to the right
        }
        return result;
    }
}
