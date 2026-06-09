package dsa.queue;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

/**
 * A FIFO queue implemented with two LIFO stacks — a classic interview question
 * that tests whether you understand both structures.
 *
 * <p>Idea: an {@code in} stack receives pushes; an {@code out} stack serves
 * removals. When {@code out} is empty we pour {@code in} into it, which reverses
 * the order — so the oldest element ends up on top of {@code out}. Each element
 * is moved between stacks at most once, giving <b>amortized O(1)</b> dequeue even
 * though a single transfer is O(n).
 *
 * @param <T> the element type
 */
public class QueueUsingTwoStacks<T> {

    private final Deque<T> in = new ArrayDeque<>();
    private final Deque<T> out = new ArrayDeque<>();

    /** Time: O(1). */
    public void enqueue(T value) {
        in.push(value);
    }

    /**
     * Time: O(1) amortized.
     *
     * @throws NoSuchElementException if empty
     */
    public T dequeue() {
        shiftIfNeeded();
        if (out.isEmpty()) {
            throw new NoSuchElementException("dequeue from empty queue");
        }
        return out.pop();
    }

    /**
     * Time: O(1) amortized.
     *
     * @throws NoSuchElementException if empty
     */
    public T peek() {
        shiftIfNeeded();
        if (out.isEmpty()) {
            throw new NoSuchElementException("peek on empty queue");
        }
        return out.peek();
    }

    public int size() {
        return in.size() + out.size();
    }

    public boolean isEmpty() {
        return in.isEmpty() && out.isEmpty();
    }

    /** Pour {@code in} into {@code out} only when {@code out} has run dry. */
    private void shiftIfNeeded() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) {
                out.push(in.pop());
            }
        }
    }
}
