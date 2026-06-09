package dsa.hashing;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class FrequenciesTest {

    @Test
    void countsCharacters() {
        Map<Character, Integer> counts = Frequencies.count("banana");
        assertEquals(3, counts.get('a'));
        assertEquals(2, counts.get('n'));
        assertEquals(1, counts.get('b'));
    }

    @Test
    void firstUniqueChar() {
        assertEquals(0, Frequencies.firstUniqueCharIndex("leetcode")); // 'l'
        assertEquals(2, Frequencies.firstUniqueCharIndex("loveleetcode")); // 'v'
        assertEquals(-1, Frequencies.firstUniqueCharIndex("aabb"));
        assertEquals(-1, Frequencies.firstUniqueCharIndex(""));
    }

    @Test
    void mostFrequentElement() {
        assertEquals(2, Frequencies.mostFrequent(new int[] {1, 2, 2, 3, 2}));
        assertEquals(7, Frequencies.mostFrequent(new int[] {7}));
    }
}
