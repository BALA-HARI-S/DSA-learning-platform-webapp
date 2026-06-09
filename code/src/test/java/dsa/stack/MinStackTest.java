package dsa.stack;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

class MinStackTest {

    @Test
    void tracksMinAcrossPushes() {
        MinStack stack = new MinStack();
        stack.push(5);
        assertEquals(5, stack.getMin());
        stack.push(3);
        assertEquals(3, stack.getMin());
        stack.push(7);
        assertEquals(3, stack.getMin());
        stack.push(2);
        assertEquals(2, stack.getMin());
    }

    @Test
    void minRestoresAfterPops() {
        MinStack stack = new MinStack();
        stack.push(5);
        stack.push(2);
        stack.push(8);
        assertEquals(2, stack.getMin());
        assertEquals(8, stack.pop());
        assertEquals(2, stack.getMin());
        assertEquals(2, stack.pop());
        assertEquals(5, stack.getMin()); // min returns to 5
        assertEquals(5, stack.top());
    }

    @Test
    void handlesDuplicateMinValues() {
        MinStack stack = new MinStack();
        stack.push(2);
        stack.push(2);
        stack.push(3);
        assertEquals(2, stack.getMin());
        stack.pop();
        assertEquals(2, stack.getMin());
        stack.pop();
        assertEquals(2, stack.getMin()); // still one 2 left
    }

    @Test
    void rejectsOperationsOnEmpty() {
        MinStack stack = new MinStack();
        assertThrows(NoSuchElementException.class, stack::pop);
        assertThrows(NoSuchElementException.class, stack::top);
        assertThrows(NoSuchElementException.class, stack::getMin);
    }
}
