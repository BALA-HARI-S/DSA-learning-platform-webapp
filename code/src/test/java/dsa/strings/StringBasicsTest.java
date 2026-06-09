package dsa.strings;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class StringBasicsTest {

    @Test
    void reversesString() {
        assertEquals("cba", StringBasics.reverse("abc"));
        assertEquals("", StringBasics.reverse(""));
        assertEquals("a", StringBasics.reverse("a"));
        assertEquals("olleh", StringBasics.reverse("hello"));
    }

    @Test
    void bothBuildersProduceSameResult() {
        char[] chars = {'d', 's', 'a', 'r', 'o', 'c', 'k', 's'};
        String expected = "dsarocks";
        assertEquals(expected, StringBasics.concatInLoopBad(chars));
        assertEquals(expected, StringBasics.buildWithStringBuilder(chars));
    }

    @Test
    void buildersHandleEmptyInput() {
        char[] empty = {};
        assertEquals("", StringBasics.concatInLoopBad(empty));
        assertEquals("", StringBasics.buildWithStringBuilder(empty));
    }
}
