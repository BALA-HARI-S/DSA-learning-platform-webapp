package dsa.linkedlists;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class SinglyLinkedListTest {

    @Test
    void newListIsEmpty() {
        SinglyLinkedList<Integer> list = new SinglyLinkedList<>();
        assertTrue(list.isEmpty());
        assertEquals(0, list.size());
        assertEquals(List.of(), list.toList());
    }

    @Test
    void addAppendsInOrder() {
        SinglyLinkedList<Integer> list = new SinglyLinkedList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        assertEquals(List.of(1, 2, 3), list.toList());
        assertEquals(3, list.size());
        assertFalse(list.isEmpty());
    }

    @Test
    void addFirstPrepends() {
        SinglyLinkedList<String> list = new SinglyLinkedList<>();
        list.add("b");
        list.addFirst("a");
        list.add("c");
        assertEquals(List.of("a", "b", "c"), list.toList());
        assertEquals(3, list.size());
    }
}
