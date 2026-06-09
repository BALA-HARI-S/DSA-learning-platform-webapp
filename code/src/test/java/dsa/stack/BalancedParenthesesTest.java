package dsa.stack;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class BalancedParenthesesTest {

    @Test
    void acceptsBalanced() {
        assertTrue(BalancedParentheses.isBalanced("()"));
        assertTrue(BalancedParentheses.isBalanced("()[]{}"));
        assertTrue(BalancedParentheses.isBalanced("{[()]}"));
        assertTrue(BalancedParentheses.isBalanced(""));
    }

    @Test
    void ignoresNonBracketCharacters() {
        assertTrue(BalancedParentheses.isBalanced("a(b)c[d]e"));
        assertTrue(BalancedParentheses.isBalanced("if (x) { y[0]; }"));
    }

    @Test
    void rejectsMismatched() {
        assertFalse(BalancedParentheses.isBalanced("(]"));
        assertFalse(BalancedParentheses.isBalanced("([)]"));
        assertFalse(BalancedParentheses.isBalanced("{[}"));
    }

    @Test
    void rejectsUnclosedOrUnopened() {
        assertFalse(BalancedParentheses.isBalanced("("));
        assertFalse(BalancedParentheses.isBalanced("(()"));
        assertFalse(BalancedParentheses.isBalanced(")"));
        assertFalse(BalancedParentheses.isBalanced("())"));
    }
}
