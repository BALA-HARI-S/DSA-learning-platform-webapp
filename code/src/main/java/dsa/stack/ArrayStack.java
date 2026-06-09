package dsa.stack;

import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * A stack (LIFO — last in, first out) built from scratch on a resizing array,
 * to show how the data structure actually works under the hood.
 *
 * <p>All operations touch only the top of the stack, so they are O(1) — the
 * {@code push} that triggers a resize is O(n) but amortizes to O(1), exactly
 * like {@link java.util.ArrayList} (see lesson 02).
 *
 * <p>In real code you would use {@link java.util.ArrayDeque} as a stack rather
 * than writing this — see the lesson notes.
 *
 * @param <T> the element type
 */
public class ArrayStack<T> {

    private Object[] elements;
    private int size;

    public ArrayStack() {
        this.elements = new Object[10];
    }

    /**
     * Pushes a value onto the top.
     *
     * <p>Time: O(1) amortized. Space: O(1) amortized.
     */
    public void push(T value) {
        if (size == elements.length) {
            elements = Arrays.copyOf(elements, elements.length * 2);
        }
        elements[size++] = value;
    }

    /**
     * Removes and returns the top value.
     *
     * <p>Time: O(1). Space: O(1).
     *
     * @throws NoSuchElementException if the stack is empty
     */
    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) {
            throw new NoSuchElementException("pop from empty stack");
        }
        T value = (T) elements[--size];
        elements[size] = null; // let the popped element be garbage-collected
        return value;
    }

    /**
     * Returns the top value without removing it.
     *
     * <p>Time: O(1). Space: O(1).
     *
     * @throws NoSuchElementException if the stack is empty
     */
    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("peek on empty stack");
        }
        return (T) elements[size - 1];
    }

    /** Number of elements. Time: O(1). */
    public int size() {
        return size;
    }

    /** Whether the stack has no elements. Time: O(1). */
    public boolean isEmpty() {
        return size == 0;
    }
}
