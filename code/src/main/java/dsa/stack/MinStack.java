package dsa.stack;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

/**
 * A stack that also reports its current minimum in O(1).
 *
 * <p>The trick: keep a second "mins" stack in lockstep with the main one. Each
 * entry in the mins stack is the minimum of everything at or below it, so the
 * current minimum is always the top of the mins stack. Pushing/popping keep both
 * stacks aligned, so {@link #getMin()} never has to scan.
 */
public class MinStack {

    private final Deque<Integer> values = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    /**
     * Pushes a value and records the running minimum.
     *
     * <p>Time: O(1). Space: O(1) per push.
     */
    public void push(int value) {
        values.push(value);
        mins.push(mins.isEmpty() ? value : Math.min(value, mins.peek()));
    }

    /**
     * Removes and returns the top value.
     *
     * <p>Time: O(1).
     *
     * @throws NoSuchElementException if empty
     */
    public int pop() {
        if (values.isEmpty()) {
            throw new NoSuchElementException("pop from empty stack");
        }
        mins.pop();
        return values.pop();
    }

    /**
     * Returns the top value without removing it. Time: O(1).
     *
     * @throws NoSuchElementException if empty
     */
    public int top() {
        if (values.isEmpty()) {
            throw new NoSuchElementException("top on empty stack");
        }
        return values.peek();
    }

    /**
     * Returns the minimum value currently in the stack. Time: O(1).
     *
     * @throws NoSuchElementException if empty
     */
    public int getMin() {
        if (mins.isEmpty()) {
            throw new NoSuchElementException("getMin on empty stack");
        }
        return mins.peek();
    }

    public boolean isEmpty() {
        return values.isEmpty();
    }
}
