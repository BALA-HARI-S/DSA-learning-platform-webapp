package dsa.hashing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Group words that are anagrams of each other.
 *
 * <p>The key idea: derive a <b>canonical signature</b> that is identical for all
 * anagrams (here, the sorted characters), and use it as a hash-map key. Words
 * collapse into groups in a single pass — hashing turns "compare every pair"
 * (O(n^2 · ...)) into O(n · k log k).
 */
public final class GroupAnagrams {

    private GroupAnagrams() {
    }

    /**
     * Groups {@code words} into lists of mutual anagrams.
     *
     * <p>Time: O(n · k log k) where n = number of words, k = max word length
     * (the sort dominates each signature). Space: O(n · k).
     */
    public static List<List<String>> group(String[] words) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String word : words) {
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String signature = new String(chars);
            groups.computeIfAbsent(signature, k -> new ArrayList<>()).add(word);
        }
        return new ArrayList<>(groups.values());
    }
}
