package dsa.sorting;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import java.util.Arrays;
import java.util.Random;
import java.util.function.Consumer;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class SortingTest {

    /** Every sort algorithm under test, as a {@code Consumer<int[]>}. */
    static Stream<Arguments> sorters() {
        return Stream.of(
                Arguments.of("bubble", (Consumer<int[]>) QuadraticSorts::bubbleSort),
                Arguments.of("selection", (Consumer<int[]>) QuadraticSorts::selectionSort),
                Arguments.of("insertion", (Consumer<int[]>) QuadraticSorts::insertionSort),
                Arguments.of("merge", (Consumer<int[]>) MergeSort::sort),
                Arguments.of("quick", (Consumer<int[]>) QuickSort::sort));
    }

    @ParameterizedTest(name = "{0} sort")
    @MethodSource("sorters")
    void sortsVariousInputs(String name, Consumer<int[]> sort) {
        assertSorts(sort, new int[] {});
        assertSorts(sort, new int[] {1});
        assertSorts(sort, new int[] {2, 1});
        assertSorts(sort, new int[] {5, 3, 8, 1, 9, 2, 7});
        assertSorts(sort, new int[] {1, 2, 3, 4, 5});          // already sorted
        assertSorts(sort, new int[] {5, 4, 3, 2, 1});          // reverse sorted
        assertSorts(sort, new int[] {3, 3, 1, 2, 3, 1});       // duplicates
        assertSorts(sort, new int[] {-2, 5, -10, 0, 3, -2});   // negatives
    }

    @ParameterizedTest(name = "{0} sort (random)")
    @MethodSource("sorters")
    void sortsRandomArray(String name, Consumer<int[]> sort) {
        Random random = new Random(42);
        int[] arr = random.ints(500, -1000, 1000).toArray();
        assertSorts(sort, arr);
    }

    private static void assertSorts(Consumer<int[]> sort, int[] input) {
        int[] expected = input.clone();
        Arrays.sort(expected); // trusted reference
        int[] actual = input.clone();
        sort.accept(actual);
        assertArrayEquals(expected, actual);
    }
}
