package dsa.recursion;

import java.util.ArrayList;
import java.util.List;

/**
 * Generating the power set (all subsets) via <b>backtracking</b> — the core
 * recursive pattern behind permutations, combinations, and constraint search.
 *
 * <p>At each element we make a binary choice: include it or not. The recursion
 * tree therefore has 2^n leaves, one per subset.
 */
public final class Subsets {

    private Subsets() {
    }

    /**
     * Returns every subset of {@code nums}.
     *
     * <p>Time: O(n · 2^n) — 2^n subsets, each up to length n to copy.
     * <br>Space: O(n) recursion depth (excluding the output).
     */
    public static List<List<Integer>> generate(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private static void backtrack(int[] nums, int start, List<Integer> current,
            List<List<Integer>> result) {
        // every node in the recursion tree is itself a valid subset
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);          // choose
            backtrack(nums, i + 1, current, result); // explore
            current.remove(current.size() - 1);      // un-choose (backtrack)
        }
    }
}
