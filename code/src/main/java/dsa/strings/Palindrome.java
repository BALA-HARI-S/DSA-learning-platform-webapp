package dsa.strings;

/**
 * Palindrome check using the two-pointer technique.
 */
public final class Palindrome {

    private Palindrome() {
    }

    /**
     * Returns {@code true} if {@code s} reads the same forwards and backwards.
     * Compares characters from both ends moving inward, stopping at the first
     * mismatch.
     *
     * <p>Time: O(n). Space: O(1) — no copy is made, we index into the string.
     */
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
