package dsa.trees;

/**
 * A binary tree node: a value plus references to up to two children.
 *
 * <p>A tree is just a node (the "root") whose children are themselves trees —
 * the recursive definition that makes most tree algorithms naturally recursive.
 *
 * @param <T> the value type
 */
public class TreeNode<T> {

    public T value;
    public TreeNode<T> left;
    public TreeNode<T> right;

    public TreeNode(T value) {
        this.value = value;
    }

    public TreeNode(T value, TreeNode<T> left, TreeNode<T> right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}
