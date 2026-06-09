package dsa.queue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

class QueueUsingTwoStacksTest {

    @Test
    void fifoOrder() {
        QueueUsingTwoStacks<Integer> q = new QueueUsingTwoStacks<>();
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
    void interleavedEnqueueDequeue() {
        QueueUsingTwoStacks<Integer> q = new QueueUsingTwoStacks<>();
        q.enqueue(1);
        q.enqueue(2);
        assertEquals(1, q.dequeue());
        q.enqueue(3);          // forces a later re-shift
        assertEquals(2, q.dequeue());
        assertEquals(3, q.dequeue());
        assertEquals(0, q.size());
    }

    @Test
    void rejectsEmptyOperations() {
        QueueUsingTwoStacks<Integer> q = new QueueUsingTwoStacks<>();
        assertThrows(NoSuchElementException.class, q::dequeue);
        assertThrows(NoSuchElementException.class, q::peek);
    }
}
