package dsa.recursion;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SubsetsTest {

    private static Set<Set<Integer>> asSetOfSets(List<List<Integer>> subsets) {
        Set<Set<Integer>> result = new HashSet<>();
        for (List<Integer> s : subsets) {
            result.add(new HashSet<>(s));
        }
        return result;
    }

    @Test
    void emptyArrayHasOnlyEmptySubset() {
        List<List<Integer>> subsets = Subsets.generate(new int[] {});
        assertEquals(1, subsets.size());
        assertTrue(subsets.get(0).isEmpty());
    }

    @Test
    void producesTwoToTheNSubsets() {
        assertEquals(8, Subsets.generate(new int[] {1, 2, 3}).size()); // 2^3
        assertEquals(16, Subsets.generate(new int[] {1, 2, 3, 4}).size()); // 2^4
    }

    @Test
    void containsExpectedSubsets() {
        Set<Set<Integer>> subsets = asSetOfSets(Subsets.generate(new int[] {1, 2, 3}));
        assertEquals(Set.of(
                Set.of(),
                Set.of(1),
                Set.of(2),
                Set.of(3),
                Set.of(1, 2),
                Set.of(1, 3),
                Set.of(2, 3),
                Set.of(1, 2, 3)), subsets);
    }
}
