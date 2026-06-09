package dsa.linkedlists;

import static dsa.linkedlists.LinkedListAlgorithms.fromValues;
import static dsa.linkedlists.LinkedListAlgorithms.toList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dsa.linkedlists.SinglyLinkedList.Node;
import java.util.List;
import org.junit.jupiter.api.Test;

class LinkedListAlgorithmsTest {

    @Test
    void reversesChain() {
        Node<Integer> reversed = LinkedListAlgorithms.reverse(fromValues(1, 2, 3, 4));
        assertEquals(List.of(4, 3, 2, 1), toList(reversed));
    }

    @Test
    void reverseHandlesEmptyAndSingle() {
        assertNull(LinkedListAlgorithms.reverse(fromValues()));
        assertEquals(List.of(7), toList(LinkedListAlgorithms.reverse(fromValues(7))));
    }

    @Test
    void findsMiddleForOddLength() {
        // 1 -> 2 -> 3 -> 4 -> 5, middle is 3
        assertEquals(3, LinkedListAlgorithms.findMiddle(fromValues(1, 2, 3, 4, 5)).value);
    }

    @Test
    void findsSecondMiddleForEvenLength() {
        // 1 -> 2 -> 3 -> 4, slow/fast lands on the second middle (3)
        assertEquals(3, LinkedListAlgorithms.findMiddle(fromValues(1, 2, 3, 4)).value);
    }

    @Test
    void detectsNoCycleInAcyclicList() {
        assertFalse(LinkedListAlgorithms.hasCycle(fromValues(1, 2, 3)));
        assertFalse(LinkedListAlgorithms.hasCycle(fromValues()));
    }

    @Test
    void detectsCycle() {
        Node<Integer> head = fromValues(1, 2, 3, 4);
        // wire the tail back to the second node to create a loop
        Node<Integer> second = head.next;
        Node<Integer> tail = head;
        while (tail.next != null) {
            tail = tail.next;
        }
        tail.next = second;
        assertTrue(LinkedListAlgorithms.hasCycle(head));
    }

    @Test
    void mergesTwoSortedChains() {
        Node<Integer> merged =
                LinkedListAlgorithms.mergeSorted(fromValues(1, 3, 5), fromValues(2, 4, 6));
        assertEquals(List.of(1, 2, 3, 4, 5, 6), toList(merged));
    }

    @Test
    void mergeHandlesEmptyOperands() {
        assertEquals(List.of(1, 2),
                toList(LinkedListAlgorithms.mergeSorted(fromValues(1, 2), LinkedListAlgorithms.<Integer>fromValues())));
        assertEquals(List.of(3, 4),
                toList(LinkedListAlgorithms.mergeSorted(LinkedListAlgorithms.<Integer>fromValues(), fromValues(3, 4))));
        assertNull(LinkedListAlgorithms.mergeSorted(
                LinkedListAlgorithms.<Integer>fromValues(), LinkedListAlgorithms.<Integer>fromValues()));
    }
}
