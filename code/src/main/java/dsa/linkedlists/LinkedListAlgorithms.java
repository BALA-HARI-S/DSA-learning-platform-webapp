package dsa.linkedlists;

import dsa.linkedlists.SinglyLinkedList.Node;
import java.util.ArrayList;
import java.util.List;

/**
 * Classic singly-linked-list algorithms that operate directly on {@link Node}
 * chains — the style you will see in interviews (LeetCode-flavored).
 *
 * <p>All of these are O(1) extra space because they rewire existing nodes or use
 * a couple of pointers rather than allocating a parallel structure.
 */
public final class LinkedListAlgorithms {

    private LinkedListAlgorithms() {
    }

    /**
     * Builds a node chain from values (test/demo helper).
     *
     * <p>Time: O(n). Space: O(n).
     */
    @SafeVarargs
    public static <T> Node<T> fromValues(T... values) {
        Node<T> dummy = new Node<>(null);
        Node<T> current = dummy;
        for (T value : values) {
            current.next = new Node<>(value);
            current = current.next;
        }
        return dummy.next;
    }

    /**
     * Collects a chain into a {@link List} (test/demo helper).
     *
     * <p>Time: O(n). Space: O(n).
     */
    public static <T> List<T> toList(Node<T> head) {
        List<T> result = new ArrayList<>();
        Node<T> current = head;
        while (current != null) {
            result.add(current.value);
            current = current.next;
        }
        return result;
    }

    /**
     * Reverses a chain by flipping each {@code next} pointer. Returns the new head
     * (the old tail). The key invariant: {@code prev} trails one node behind
     * {@code current}, and we must stash {@code current.next} before overwriting it.
     *
     * <p>Time: O(n). Space: O(1).
     */
    public static <T> Node<T> reverse(Node<T> head) {
        Node<T> prev = null;
        Node<T> current = head;
        while (current != null) {
            Node<T> next = current.next; // stash before we rewire
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev;
    }

    /**
     * Finds the middle node using the slow/fast (tortoise/hare) technique: the
     * fast pointer moves two steps for every one of the slow pointer, so when fast
     * reaches the end, slow is at the middle. For even length this returns the
     * second of the two middle nodes.
     *
     * <p>Time: O(n). Space: O(1).
     */
    public static <T> Node<T> findMiddle(Node<T> head) {
        Node<T> slow = head;
        Node<T> fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    /**
     * Detects a cycle using Floyd's algorithm. If a fast pointer (two steps) ever
     * meets a slow pointer (one step), there is a loop; if fast falls off the end,
     * there is not.
     *
     * <p>Time: O(n). Space: O(1).
     */
    public static <T> boolean hasCycle(Node<T> head) {
        Node<T> slow = head;
        Node<T> fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }

    /**
     * Merges two sorted chains into one sorted chain by splicing existing nodes
     * (no new value nodes are allocated). A dummy head simplifies the edge cases.
     *
     * <p>Time: O(n + m). Space: O(1).
     */
    public static <T extends Comparable<T>> Node<T> mergeSorted(Node<T> a, Node<T> b) {
        Node<T> dummy = new Node<>(null);
        Node<T> tail = dummy;
        while (a != null && b != null) {
            if (a.value.compareTo(b.value) <= 0) {
                tail.next = a;
                a = a.next;
            } else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }
}
