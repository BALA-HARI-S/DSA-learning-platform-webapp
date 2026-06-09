package dsa.hashing;

import java.util.ArrayList;
import java.util.List;

/**
 * A minimal hash map built from scratch with <b>separate chaining</b>, to show
 * how {@link java.util.HashMap} works internally: a bucket array where each
 * bucket holds a list of entries that hashed to the same slot.
 *
 * <p>Average-case put/get/remove are O(1): hash the key to a bucket, then scan
 * that (short) bucket. They degrade to O(n) only if every key collides into one
 * bucket. To keep buckets short we <b>resize</b> (double + rehash) when the load
 * factor — entries / buckets — exceeds a threshold.
 *
 * @param <K> key type
 * @param <V> value type
 */
public class SimpleHashMap<K, V> {

    private static final double LOAD_FACTOR = 0.75;

    private static final class Entry<K, V> {
        final K key;
        V value;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private List<Entry<K, V>>[] buckets;
    private int size;

    public SimpleHashMap() {
        this(16);
    }

    @SuppressWarnings("unchecked")
    public SimpleHashMap(int initialBuckets) {
        buckets = (List<Entry<K, V>>[]) new List[Math.max(1, initialBuckets)];
    }

    /** Maps a key's hash to a bucket index (non-negative, within range). */
    private int bucketIndex(K key, int numBuckets) {
        int h = (key == null) ? 0 : key.hashCode();
        return Math.floorMod(h, numBuckets);
    }

    /**
     * Inserts or updates the value for {@code key}.
     *
     * <p>Time: O(1) average, O(n) worst case. Space: O(1) amortized.
     */
    public void put(K key, V value) {
        int index = bucketIndex(key, buckets.length);
        if (buckets[index] == null) {
            buckets[index] = new ArrayList<>();
        }
        for (Entry<K, V> e : buckets[index]) {
            if (java.util.Objects.equals(e.key, key)) {
                e.value = value; // update in place
                return;
            }
        }
        buckets[index].add(new Entry<>(key, value));
        size++;
        if ((double) size / buckets.length > LOAD_FACTOR) {
            resize();
        }
    }

    /**
     * Returns the value for {@code key}, or {@code null} if absent.
     *
     * <p>Time: O(1) average.
     */
    public V get(K key) {
        int index = bucketIndex(key, buckets.length);
        if (buckets[index] != null) {
            for (Entry<K, V> e : buckets[index]) {
                if (java.util.Objects.equals(e.key, key)) {
                    return e.value;
                }
            }
        }
        return null;
    }

    public boolean containsKey(K key) {
        int index = bucketIndex(key, buckets.length);
        if (buckets[index] != null) {
            for (Entry<K, V> e : buckets[index]) {
                if (java.util.Objects.equals(e.key, key)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Removes {@code key} if present. Returns {@code true} if something was removed.
     *
     * <p>Time: O(1) average.
     */
    public boolean remove(K key) {
        int index = bucketIndex(key, buckets.length);
        if (buckets[index] != null) {
            List<Entry<K, V>> bucket = buckets[index];
            for (int i = 0; i < bucket.size(); i++) {
                if (java.util.Objects.equals(bucket.get(i).key, key)) {
                    bucket.remove(i);
                    size--;
                    return true;
                }
            }
        }
        return false;
    }

    public int size() {
        return size;
    }

    /** Doubles the bucket count and re-hashes every entry into the new array. */
    @SuppressWarnings("unchecked")
    private void resize() {
        List<Entry<K, V>>[] old = buckets;
        List<Entry<K, V>>[] bigger = (List<Entry<K, V>>[]) new List[old.length * 2];
        for (List<Entry<K, V>> bucket : old) {
            if (bucket == null) {
                continue;
            }
            for (Entry<K, V> e : bucket) {
                int index = bucketIndex(e.key, bigger.length);
                if (bigger[index] == null) {
                    bigger[index] = new ArrayList<>();
                }
                bigger[index].add(e);
            }
        }
        buckets = bigger;
    }
}
