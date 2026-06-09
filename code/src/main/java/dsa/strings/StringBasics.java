package dsa.strings;

/**
 * String fundamentals in Java.
 *
 * <p>Java {@link String}s are immutable: every operation that "changes" a string
 * actually allocates a new one. That single fact drives most string complexity
 * gotchas — see {@link #concatInLoopBad} vs {@link #buildWithStringBuilder}.
 */
public final class StringBasics {

    private StringBasics() {
    }

    /**
     * Reverses a string. Because {@code String} is immutable we work on a
     * {@code char[]} copy and build a new string from it.
     *
     * <p>Time: O(n). Space: O(n) for the character buffer.
     */
    public static String reverse(String s) {
        char[] chars = s.toCharArray();
        int left = 0;
        int right = chars.length - 1;
        while (left < right) {
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;
            left++;
            right--;
        }
        return new String(chars);
    }

    /**
     * ANTI-PATTERN, shown for teaching only. Building a string with {@code +=}
     * inside a loop reallocates and recopies the whole accumulated string on
     * every iteration.
     *
     * <p>Time: O(n^2). Space: O(n). Prefer {@link #buildWithStringBuilder}.
     */
    public static String concatInLoopBad(char[] chars) {
        String result = "";
        for (char c : chars) {
            result += c; // each += copies the whole string built so far
        }
        return result;
    }

    /**
     * The correct way to assemble a string incrementally. {@link StringBuilder}
     * keeps a mutable, amortized-O(1)-append char buffer.
     *
     * <p>Time: O(n). Space: O(n).
     */
    public static String buildWithStringBuilder(char[] chars) {
        StringBuilder sb = new StringBuilder(chars.length);
        for (char c : chars) {
            sb.append(c);
        }
        return sb.toString();
    }
}
