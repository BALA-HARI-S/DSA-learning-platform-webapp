package dsa.stack;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * The canonical stack problem: are the brackets in a string balanced?
 *
 * <p>A stack is the natural fit because brackets nest — the most recently opened
 * bracket must be the first one closed (LIFO). Push every opener; on a closer,
 * the top of the stack must be its matching opener.
 */
public final class BalancedParentheses {

    private BalancedParentheses() {
    }

    /**
     * Returns {@code true} if every {@code (}, {@code [}, {@code &#123;} is closed by the
     * correct matching bracket in the correct order. Non-bracket characters are ignored.
     *
     * <p>Time: O(n). Space: O(n) — worst case all openers sit on the stack.
     */
    public static boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '(', '[', '{' -> stack.push(c);
                case ')' -> { if (stack.isEmpty() || stack.pop() != '(') return false; }
                case ']' -> { if (stack.isEmpty() || stack.pop() != '[') return false; }
                case '}' -> { if (stack.isEmpty() || stack.pop() != '{') return false; }
                default -> { /* ignore non-bracket characters */ }
            }
        }
        return stack.isEmpty(); // anything left over means an unclosed opener
    }
}
