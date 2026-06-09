package dsa.bst;

import java.util.ArrayList;
import java.util.List;

/**
 * A binary search tree (BST): a binary tree with the ordering invariant that, for
 * every node, all values in the left subtree are smaller and all values in the
 * right subtree are larger.
 *
 * <p>That invariant turns the tree into a searchable structure: at each node you
 * discard half the remaining tree, just like binary search on a sorted array.
 * Operations are O(h) where h is the height — O(log n) when the tree is balanced,
 * but O(n) if inserts arrive in sorted order and the tree degenerates into a list
 * (which is why self-balancing trees like the JDK's red-black {@code TreeMap} exist).
 *
 * @param <T> element type, must be {@link Comparable}
 */
public class BinarySearchTree<T extends Comparable<T>> {

    private static final class Node<T> {
        T value;
        Node<T> left;
        Node<T> right;

        Node(T value) {
            this.value = value;
        }
    }

    private Node<T> root;
    private int size;

    /**
     * Inserts {@code value} (duplicates are ignored).
     *
     * <p>Time: O(h) — O(log n) balanced, O(n) worst case.
     */
    public void insert(T value) {
        root = insert(root, value);
    }

    private Node<T> insert(Node<T> node, T value) {
        if (node == null) {
            size++;
            return new Node<>(value);
        }
        int cmp = value.compareTo(node.value);
        if (cmp < 0) {
            node.left = insert(node.left, value);
        } else if (cmp > 0) {
            node.right = insert(node.right, value);
        }
        // cmp == 0: duplicate, ignore
        return node;
    }

    /**
     * Returns {@code true} if {@code value} is present.
     *
     * <p>Time: O(h).
     */
    public boolean contains(T value) {
        Node<T> node = root;
        while (node != null) {
            int cmp = value.compareTo(node.value);
            if (cmp == 0) {
                return true;
            }
            node = (cmp < 0) ? node.left : node.right;
        }
        return false;
    }

    /**
     * Removes {@code value} if present. Handles the three delete cases: leaf,
     * one child, and two children (replace with the in-order successor — the
     * smallest value in the right subtree).
     *
     * <p>Time: O(h).
     */
    public void delete(T value) {
        root = delete(root, value);
    }

    private Node<T> delete(Node<T> node, T value) {
        if (node == null) {
            return null; // value absent — nothing removed
        }
        int cmp = value.compareTo(node.value);
        if (cmp < 0) {
            node.left = delete(node.left, value);
        } else if (cmp > 0) {
            node.right = delete(node.right, value);
        } else {
            // found it — physical removal happens in exactly one of these branches
            if (node.left == null) {
                size--;
                return node.right;
            }
            if (node.right == null) {
                size--;
                return node.left;
            }
            // two children: overwrite with the in-order successor, then delete the
            // successor from the right subtree (that recursive call decrements size)
            Node<T> successor = min(node.right);
            node.value = successor.value;
            node.right = delete(node.right, successor.value);
        }
        return node;
    }

    private Node<T> min(Node<T> node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    /**
     * Returns the smallest value.
     *
     * <p>Time: O(h).
     *
     * @throws java.util.NoSuchElementException if empty
     */
    public T min() {
        if (root == null) {
            throw new java.util.NoSuchElementException("empty tree");
        }
        return min(root).value;
    }

    /**
     * Returns all values in ascending order (an in-order traversal).
     *
     * <p>Time: O(n). Space: O(n).
     */
    public List<T> inorder() {
        List<T> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }

    private void inorder(Node<T> node, List<T> out) {
        if (node == null) {
            return;
        }
        inorder(node.left, out);
        out.add(node.value);
        inorder(node.right, out);
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }
}
