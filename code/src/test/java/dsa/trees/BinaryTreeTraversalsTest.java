package dsa.trees;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

class BinaryTreeTraversalsTest {

    /**
     * Builds:
     *           4
     *         /   \
     *        2     6
     *       / \   / \
     *      1   3 5   7
     */
    private static TreeNode<Integer> sampleTree() {
        TreeNode<Integer> left = new TreeNode<>(2, new TreeNode<>(1), new TreeNode<>(3));
        TreeNode<Integer> right = new TreeNode<>(6, new TreeNode<>(5), new TreeNode<>(7));
        return new TreeNode<>(4, left, right);
    }

    @Test
    void inorderIsSortedForBst() {
        assertEquals(List.of(1, 2, 3, 4, 5, 6, 7), BinaryTreeTraversals.inorder(sampleTree()));
    }

    @Test
    void preorder() {
        assertEquals(List.of(4, 2, 1, 3, 6, 5, 7), BinaryTreeTraversals.preorder(sampleTree()));
    }

    @Test
    void postorder() {
        assertEquals(List.of(1, 3, 2, 5, 7, 6, 4), BinaryTreeTraversals.postorder(sampleTree()));
    }

    @Test
    void levelOrder() {
        assertEquals(List.of(4, 2, 6, 1, 3, 5, 7), BinaryTreeTraversals.levelOrder(sampleTree()));
    }

    @Test
    void heightAndSize() {
        assertEquals(2, BinaryTreeTraversals.height(sampleTree())); // 2 edges root->leaf
        assertEquals(7, BinaryTreeTraversals.size(sampleTree()));
    }

    @Test
    void handlesEmptyTree() {
        assertTrue(BinaryTreeTraversals.inorder(null).isEmpty());
        assertTrue(BinaryTreeTraversals.levelOrder(null).isEmpty());
        assertEquals(-1, BinaryTreeTraversals.height(null));
        assertEquals(0, BinaryTreeTraversals.size(null));
    }

    @Test
    void singleNode() {
        TreeNode<Integer> root = new TreeNode<>(42);
        assertEquals(List.of(42), BinaryTreeTraversals.inorder(root));
        assertEquals(0, BinaryTreeTraversals.height(root));
        assertEquals(1, BinaryTreeTraversals.size(root));
    }
}
