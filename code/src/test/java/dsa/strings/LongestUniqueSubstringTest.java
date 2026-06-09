package dsa.strings;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LongestUniqueSubstringTest {

    @Test
    void findsLongestUniqueRun() {
        assertEquals(3, LongestUniqueSubstring.lengthOfLongest("abcabcbb")); // "abc"
        assertEquals(1, LongestUniqueSubstring.lengthOfLongest("bbbbb"));    // "b"
        assertEquals(3, LongestUniqueSubstring.lengthOfLongest("pwwkew"));   // "wke"
    }

    @Test
    void handlesEmptyString() {
        assertEquals(0, LongestUniqueSubstring.lengthOfLongest(""));
    }

    @Test
    void handlesAllUniqueAndRepeatAcrossWindow() {
        assertEquals(6, LongestUniqueSubstring.lengthOfLongest("abcdef"));
        // "tmmzuxt": longest is "mzuxt" (5) — left must not jump backwards past 't'
        assertEquals(5, LongestUniqueSubstring.lengthOfLongest("tmmzuxt"));
    }
}
