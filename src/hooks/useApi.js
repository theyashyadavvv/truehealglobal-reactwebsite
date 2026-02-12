/**
 * useApi — generic data-fetching hook with loading/error/data states.
 * Replaces the manual useState + useEffect pattern across all pages.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @param {Function} fetchFn — async function that returns data
 * @param {object} options
 * @param {any[]} options.deps — dependency array (re-fetches when changed)
 * @param {boolean} options.immediate — whether to fetch on mount (default: true)
 * @param {any} options.initialData — initial data state
 * @param {Function} options.transform — transform response before storing
 */
export function useApi(fetchFn, { deps = [], immediate = true, initialData = null, transform } = {}) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn(...args);
            if (mountedRef.current) {
                setData(transform ? transform(result) : result);
            }
            return result;
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message || 'Something went wrong');
            }
            throw err;
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [fetchFn, transform]);

    useEffect(() => {
        if (immediate) {
            execute().catch(() => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    const refetch = useCallback((...args) => execute(...args).catch(() => {}), [execute]);

    return { data, loading, error, refetch, setData };
}

export default useApi;
