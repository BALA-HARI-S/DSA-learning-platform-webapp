package dsa.strings;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class AnagramTest {

    @Test
    void recognizesAnagrams() {
        assertTrue(Anagram.areAnagrams("listen", "silent"));
        assertTrue(Anagram.areAnagrams("anagram", "nagaram"));
        assertTrue(Anagram.areAnagrams("", ""));
    }

    @Test
    void rejectsNonAnagrams() {
        assertFalse(Anagram.areAnagrams("rat", "car"));
        assertFalse(Anagram.areAnagrams("hello", "world"));
    }

    @Test
    void differentLengthsAreNotAnagrams() {
        assertFalse(Anagram.areAnagrams("aa", "a"));
        assertFalse(Anagram.areAnagrams("abc", "ab"));
    }

    @Test
    void repeatedCharactersMustMatchCounts() {
        assertFalse(Anagram.areAnagrams("aabb", "abbb"));
        assertTrue(Anagram.areAnagrams("aabb", "bbaa"));
    }
}
