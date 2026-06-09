package dsa.arrays;

/**
 * Prefix-sum (cumulative-sum) precomputation for fast range-sum queries.
 *
 * <p>The idea: spend O(n) once to build a cumulative-sum array, then answer any
 * "sum of elements between indices i and j" query in O(1). This is the classic
 * pattern behind reporting/aggregation over a fixed dataset, where you query the
 * same data many times.
 */
public final class PrefixSum {

    /** prefix[i] = sum of the first i elements (prefix[0] == 0). */
    private final long[] prefix;

    /**
     * Builds the prefix-sum array.
     *
     * <p>Time: O(n). Space: O(n).
     */
    public PrefixSum(int[] nums) {
        prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    /**
     * Sum of {@code nums[from .. to]}, inclusive on both ends.
     *
     * <p>Time: O(1) per query. Space: O(1).
     *
     * @throws IndexOutOfBoundsException if the range is invalid
     */
    public long rangeSum(int from, int to) {
        if (from < 0 || to >= prefix.length - 1 || from > to) {
            throw new IndexOutOfBoundsException("invalid range [" + from + ", " + to + "]");
        }
        return prefix[to + 1] - prefix[from];
    }
}
