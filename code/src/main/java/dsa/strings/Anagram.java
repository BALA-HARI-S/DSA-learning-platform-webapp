package dsa.strings;

import java.util.HashMap;
import java.util.Map;

/**
 * Anagram detection via frequency counting.
 *
 * <p>Two strings are anagrams if they contain exactly the same characters with
 * the same counts. Sorting both and comparing is O(n log n); counting frequencies
 * is O(n).
 */
public final class Anagram {

    private Anagram() {
    }

    /**
     * Returns {@code true} if {@code a} and {@code b} are anagrams of each other.
     * Builds a character-count map from the first string and decrements it while
     * scanning the second; any count going negative (or a length mismatch) means
     * they differ.
     *
     * <p>Time: O(n). Space: O(k) where k is the number of distinct characters
     * (bounded by the alphabet size, so effectively O(1) for a fixed alphabet).
     */
    public static boolean areAnagrams(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        Map<Character, Integer> counts = new HashMap<>();
        for (int i = 0; i < a.length(); i++) {
            counts.merge(a.charAt(i), 1, Integer::sum);
        }
        for (int i = 0; i < b.length(); i++) {
            char c = b.charAt(i);
            Integer count = counts.get(c);
            if (count == null || count == 0) {
                return false;
            }
            counts.put(c, count - 1);
        }
        return true;
    }
}
