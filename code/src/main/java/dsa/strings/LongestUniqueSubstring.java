package dsa.strings;

import java.util.HashMap;
import java.util.Map;

/**
 * "Longest substring without repeating characters" — the textbook
 * variable-size sliding-window problem.
 */
public final class LongestUniqueSubstring {

    private LongestUniqueSubstring() {
    }

    /**
     * Returns the length of the longest substring of {@code s} that contains no
     * repeated character.
     *
     * <p>A window {@code [left, right]} expands by moving {@code right}. When the
     * incoming character was already seen inside the window, {@code left} jumps
     * past its previous position so the window stays unique. Each character is
     * visited at most twice.
     *
     * <p>Time: O(n). Space: O(k) for the last-seen-index map (k = distinct chars).
     */
    public static int lengthOfLongest(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int longest = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer prev = lastSeen.get(c);
            if (prev != null && prev >= left) {
                left = prev + 1;
            }
            lastSeen.put(c, right);
            longest = Math.max(longest, right - left + 1);
        }
        return longest;
    }
}
