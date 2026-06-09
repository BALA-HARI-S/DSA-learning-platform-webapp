package dsa.bst;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

class BinarySearchTreeTest {

    private static BinarySearchTree<Integer> treeOf(int... values) {
        BinarySearchTree<Integer> bst = new BinarySearchTree<>();
        for (int v : values) {
            bst.insert(v);
        }
        return bst;
    }

    @Test
    void insertAndContains() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7, 2, 4, 6, 8);
        assertTrue(bst.contains(6));
        assertTrue(bst.contains(2));
        assertFalse(bst.contains(99));
        assertEquals(7, bst.size());
    }

    @Test
    void inorderReturnsSorted() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7, 2, 4, 6, 8, 1);
        assertEquals(List.of(1, 2, 3, 4, 5, 6, 7, 8), bst.inorder());
    }

    @Test
    void duplicatesAreIgnored() {
        BinarySearchTree<Integer> bst = treeOf(5, 5, 5, 3, 3);
        assertEquals(2, bst.size());
        assertEquals(List.of(3, 5), bst.inorder());
    }

    @Test
    void deleteLeaf() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7);
        bst.delete(3);
        assertFalse(bst.contains(3));
        assertEquals(2, bst.size());
        assertEquals(List.of(5, 7), bst.inorder());
    }

    @Test
    void deleteNodeWithOneChild() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7, 6);
        bst.delete(7); // 7 has only a left child (6)
        assertFalse(bst.contains(7));
        assertEquals(List.of(3, 5, 6), bst.inorder());
        assertEquals(3, bst.size());
    }

    @Test
    void deleteNodeWithTwoChildren() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 8, 2, 4, 7, 9);
        bst.delete(8); // two children: successor is 9
        assertFalse(bst.contains(8));
        assertEquals(List.of(2, 3, 4, 5, 7, 9), bst.inorder());
        assertEquals(6, bst.size());
        assertTrue(bst.contains(7)); // subtree preserved
    }

    @Test
    void deleteRootRepeatedlyStaysSorted() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 8, 2, 4, 7, 9, 1, 6);
        bst.delete(5);
        bst.delete(8);
        bst.delete(3);
        assertEquals(List.of(1, 2, 4, 6, 7, 9), bst.inorder());
        assertEquals(6, bst.size());
    }

    @Test
    void deleteAbsentValueIsNoOp() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7);
        bst.delete(100);
        assertEquals(3, bst.size());
        assertEquals(List.of(3, 5, 7), bst.inorder());
    }

    @Test
    void minAndEmpty() {
        BinarySearchTree<Integer> bst = treeOf(5, 3, 7, 1);
        assertEquals(1, bst.min());

        BinarySearchTree<Integer> empty = new BinarySearchTree<>();
        assertTrue(empty.isEmpty());
        assertThrows(NoSuchElementException.class, empty::min);
    }
}
