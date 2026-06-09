package dsa.hashing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class SimpleHashMapTest {

    @Test
    void putGet() {
        SimpleHashMap<String, Integer> map = new SimpleHashMap<>();
        map.put("a", 1);
        map.put("b", 2);
        assertEquals(1, map.get("a"));
        assertEquals(2, map.get("b"));
        assertNull(map.get("missing"));
        assertEquals(2, map.size());
    }

    @Test
    void updateOverwritesValueNotSize() {
        SimpleHashMap<String, Integer> map = new SimpleHashMap<>();
        map.put("a", 1);
        map.put("a", 99);
        assertEquals(99, map.get("a"));
        assertEquals(1, map.size());
    }

    @Test
    void containsAndRemove() {
        SimpleHashMap<String, Integer> map = new SimpleHashMap<>();
        map.put("x", 10);
        assertTrue(map.containsKey("x"));
        assertTrue(map.remove("x"));
        assertFalse(map.containsKey("x"));
        assertFalse(map.remove("x"));
        assertEquals(0, map.size());
    }

    @Test
    void growsAndRehashesWithManyEntries() {
        SimpleHashMap<Integer, Integer> map = new SimpleHashMap<>(2); // force resizes
        for (int i = 0; i < 1000; i++) {
            map.put(i, i * 2);
        }
        assertEquals(1000, map.size());
        for (int i = 0; i < 1000; i++) {
            assertEquals(i * 2, map.get(i));
        }
    }

    @Test
    void handlesNullKey() {
        SimpleHashMap<String, String> map = new SimpleHashMap<>();
        map.put(null, "nullval");
        assertEquals("nullval", map.get(null));
        assertTrue(map.containsKey(null));
    }
}
