package dsa.arrays;

import java.util.HashMap;
import java.util.Map;

/**
 * The classic "two sum" problem: given an array and a target, find two indices
 * whose values add up to the target.
 *
 * <p>This is the canonical example of trading space for time: the naive
 * nested-loop solution is O(n^2) time / O(1) space, while the HashMap solution
 * below is O(n) time / O(n) space.
 */
public final class TwoSum {

    private TwoSum() {
    }

    /**
     * Naive approach for comparison — check every pair.
     *
     * <p>Time: O(n^2). Space: O(1).
     *
     * @return the two indices, or {@code null} if no pair sums to {@code target}
     */
    public static int[] bruteForce(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        return null;
    }

    /**
     * HashMap approach. As we scan, we ask "have I already seen the number that
     * completes the target?" — an average O(1) lookup — before storing the
     * current value.
     *
     * <p>Time: O(n) average. Space: O(n) for the seen-values map.
     *
     * @return the two indices, or {@code null} if no pair sums to {@code target}
     */
    public static int[] withHashMap(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] {seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return null;
    }
}
