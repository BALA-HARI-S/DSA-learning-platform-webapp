package dsa.hashing;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GroupAnagramsTest {

    /** Group order and within-group order are unspecified, so compare as a set of sets. */
    private static Set<Set<String>> normalize(List<List<String>> groups) {
        Set<Set<String>> result = new HashSet<>();
        for (List<String> group : groups) {
            result.add(new HashSet<>(group));
        }
        return result;
    }

    @Test
    void groupsAnagramsTogether() {
        List<List<String>> groups =
                GroupAnagrams.group(new String[] {"eat", "tea", "tan", "ate", "nat", "bat"});
        Set<Set<String>> expected = Set.of(
                Set.of("eat", "tea", "ate"),
                Set.of("tan", "nat"),
                Set.of("bat"));
        assertEquals(expected, normalize(groups));
    }

    @Test
    void handlesSingleAndEmptyWords() {
        List<List<String>> groups = GroupAnagrams.group(new String[] {"", "", "a"});
        Set<Set<String>> expected = Set.of(Set.of(""), Set.of("a"));
        assertEquals(expected, normalize(groups));
    }

    @Test
    void emptyInput() {
        assertEquals(0, GroupAnagrams.group(new String[] {}).size());
    }
}
