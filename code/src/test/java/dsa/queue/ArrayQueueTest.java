package dsa.queue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

class ArrayQueueTest {

    @Test
    void fifoOrder() {
        ArrayQueue<Integer> q = new ArrayQueue<>();
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        assertEquals(1, q.peek());
        assertEquals(1, q.dequeue());
        assertEquals(2, q.dequeue());
        assertEquals(3, q.dequeue());
        assertTrue(q.isEmpty());
    }

    @Test
    void wrapsAroundAndGrows() {
        ArrayQueue<Integer> q = new ArrayQueue<>();
        // interleave to exercise circular wrap-around and resize
        for (int i = 0; i < 50; i++) {
            q.enqueue(i);
        }
        for (int i = 0; i < 25; i++) {
            assertEquals(i, q.dequeue());
        }
        for (int i = 50; i < 100; i++) {
            q.enqueue(i);
        }
        assertEquals(75, q.size());
        for (int i = 25; i < 100; i++) {
            assertEquals(i, q.dequeue());
        }
        assertTrue(q.isEmpty());
    }

    @Test
    void rejectsEmptyOperations() {
        ArrayQueue<Integer> q = new ArrayQueue<>();
        assertThrows(NoSuchElementException.class, q::dequeue);
        assertThrows(NoSuchElementException.class, q::peek);
    }
}
