package dsa.queue;

import java.util.NoSuchElementException;

/**
 * A queue (FIFO — first in, first out) built from scratch on a <b>circular</b>
 * array, to show how the data structure works under the hood.
 *
 * <p>A naive array queue that always removes from index 0 would be O(n) per
 * dequeue (everything shifts left). The circular trick keeps a {@code head} and
 * {@code tail} index that wrap around with modulo, making both enqueue and
 * dequeue O(1).
 *
 * <p>In real code you would use {@link java.util.ArrayDeque} — see the lesson notes.
 *
 * @param <T> the element type
 */
public class ArrayQueue<T> {

    private Object[] elements;
    private int head;  // index of the front element
    private int tail;  // index where the next element will be written
    private int size;

    public ArrayQueue() {
        this.elements = new Object[10];
    }

    /**
     * Adds a value to the back of the queue.
     *
     * <p>Time: O(1) amortized. Space: O(1) amortized.
     */
    public void enqueue(T value) {
        if (size == elements.length) {
            grow();
        }
        elements[tail] = value;
        tail = (tail + 1) % elements.length; // wrap around
        size++;
    }

    /**
     * Removes and returns the value at the front.
     *
     * <p>Time: O(1). Space: O(1).
     *
     * @throws NoSuchElementException if the queue is empty
     */
    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("dequeue from empty queue");
        }
        T value = (T) elements[head];
        elements[head] = null; // allow GC
        head = (head + 1) % elements.length;
        size--;
        return value;
    }

    /**
     * Returns the front value without removing it.
     *
     * <p>Time: O(1).
     *
     * @throws NoSuchElementException if the queue is empty
     */
    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("peek on empty queue");
        }
        return (T) elements[head];
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    /** Doubles capacity and re-lays the elements out starting at index 0. */
    private void grow() {
        Object[] bigger = new Object[elements.length * 2];
        for (int i = 0; i < size; i++) {
            bigger[i] = elements[(head + i) % elements.length];
        }
        elements = bigger;
        head = 0;
        tail = size;
    }
}
