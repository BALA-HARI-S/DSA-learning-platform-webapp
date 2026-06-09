package dsa.hashing;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Frequency-counting problems — the bread-and-butter use of a hash map: turn an
 * O(n^2) "count occurrences" scan into a single O(n) pass.
 */
public final class Frequencies {

    private Frequencies() {
    }

    /**
     * Returns a map of each character to its count.
     *
     * <p>Time: O(n). Space: O(k) for k distinct characters.
     */
    public static Map<Character, Integer> count(String s) {
        Map<Character, Integer> counts = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            counts.merge(s.charAt(i), 1, Integer::sum);
        }
        return counts;
    }

    /**
     * Returns the index of the first character that appears exactly once, or
     * {@code -1} if there is none. Uses a <b>linked</b> hash map so a second pass
     * can rely on insertion order.
     *
     * <p>Time: O(n). Space: O(k).
     */
    public static int firstUniqueCharIndex(String s) {
        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (int i = 0; i < s.length(); i++) {
            counts.merge(s.charAt(i), 1, Integer::sum);
        }
        for (int i = 0; i < s.length(); i++) {
            if (counts.get(s.charAt(i)) == 1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns the most frequent element in {@code nums} (ties resolved by first
     * to reach the max count).
     *
     * <p>Time: O(n). Space: O(k).
     *
     * @throws IllegalArgumentException if the array is empty
     */
    public static int mostFrequent(int[] nums) {
        if (nums.length == 0) {
            throw new IllegalArgumentException("nums must not be empty");
        }
        Map<Integer, Integer> counts = new HashMap<>();
        int best = nums[0];
        int bestCount = 0;
        for (int n : nums) {
            int c = counts.merge(n, 1, Integer::sum);
            if (c > bestCount) {
                bestCount = c;
                best = n;
            }
        }
        return best;
    }
}
