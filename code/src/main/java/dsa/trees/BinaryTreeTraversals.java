package dsa.trees;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

/**
 * The four canonical binary-tree traversals, plus height and size.
 *
 * <p><b>Depth-first</b> (recursive, uses the call stack): pre/in/post-order differ
 * only in <i>when</i> you visit the node relative to its children.
 * <br><b>Breadth-first</b> (level-order, uses an explicit {@link Queue}): visit the
 * tree level by level — this is BFS, the same idea you'll reuse on graphs.
 *
 * <p>All traversals are O(n) time (each node visited once). Space is O(h) for the
 * DFS call stack (h = height) and O(w) for BFS (w = max level width).
 */
public final class BinaryTreeTraversals {

    private BinaryTreeTraversals() {
    }

    /** Left, Node, Right — for a BST this yields values in sorted order. */
    public static <T> List<T> inorder(TreeNode<T> root) {
        List<T> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }

    private static <T> void inorder(TreeNode<T> node, List<T> out) {
        if (node == null) {
            return;
        }
        inorder(node.left, out);
        out.add(node.value);
        inorder(node.right, out);
    }

    /** Node, Left, Right — useful for copying/serializing a tree. */
    public static <T> List<T> preorder(TreeNode<T> root) {
        List<T> result = new ArrayList<>();
        preorder(root, result);
        return result;
    }

    private static <T> void preorder(TreeNode<T> node, List<T> out) {
        if (node == null) {
            return;
        }
        out.add(node.value);
        preorder(node.left, out);
        preorder(node.right, out);
    }

    /** Left, Right, Node — children before parent (e.g. deleting/freeing a tree). */
    public static <T> List<T> postorder(TreeNode<T> root) {
        List<T> result = new ArrayList<>();
        postorder(root, result);
        return result;
    }

    private static <T> void postorder(TreeNode<T> node, List<T> out) {
        if (node == null) {
            return;
        }
        postorder(node.left, out);
        postorder(node.right, out);
        out.add(node.value);
    }

    /** Breadth-first: level by level, left to right. Uses a queue. */
    public static <T> List<T> levelOrder(TreeNode<T> root) {
        List<T> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode<T>> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode<T> node = queue.poll();
            result.add(node.value);
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        return result;
    }

    /** Number of edges on the longest root-to-leaf path; -1 for an empty tree. */
    public static <T> int height(TreeNode<T> root) {
        if (root == null) {
            return -1;
        }
        return 1 + Math.max(height(root.left), height(root.right));
    }

    /** Total number of nodes. */
    public static <T> int size(TreeNode<T> root) {
        if (root == null) {
            return 0;
        }
        return 1 + size(root.left) + size(root.right);
    }
}
