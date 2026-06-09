package dsa.linkedlists;

import java.util.ArrayList;
import java.util.List;

/**
 * A minimal singly linked list, built from scratch to show the node/pointer model.
 *
 * <p>Each {@link Node} holds a value and a reference ({@code next}) to the next
 * node. Unlike an array, elements are not contiguous in memory — you reach the
 * nth element only by walking the chain from the head, which is why indexed
 * access is O(n) rather than O(1).
 *
 * @param <T> the element type
 */
public class SinglyLinkedList<T> {

    /** A single link in the chain. Package-private so algorithms can traverse it. */
    static final class Node<T> {
        T value;
        Node<T> next;

        Node(T value) {
            this.value = value;
        }
    }

    private Node<T> head;
    private Node<T> tail;
    private int size;

    /**
     * Appends a value at the end. Because we keep a {@code tail} pointer this is
     * O(1); without one it would be O(n).
     *
     * <p>Time: O(1). Space: O(1).
     */
    public void add(T value) {
        Node<T> node = new Node<>(value);
        if (head == null) {
            head = node;
            tail = node;
        } else {
            tail.next = node;
            tail = node;
        }
        size++;
    }

    /**
     * Inserts a value at the front.
     *
     * <p>Time: O(1). Space: O(1).
     */
    public void addFirst(T value) {
        Node<T> node = new Node<>(value);
        node.next = head;
        head = node;
        if (tail == null) {
            tail = node;
        }
        size++;
    }

    /** Number of elements. Time: O(1). */
    public int size() {
        return size;
    }

    /** Whether the list has no elements. Time: O(1). */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Copies the list into a {@link List} for easy assertions/printing.
     *
     * <p>Time: O(n). Space: O(n).
     */
    public List<T> toList() {
        List<T> result = new ArrayList<>(size);
        Node<T> current = head;
        while (current != null) {
            result.add(current.value);
            current = current.next;
        }
        return result;
    }

    /** Exposes the head node for the standalone algorithms in this package. */
    Node<T> head() {
        return head;
    }
}
