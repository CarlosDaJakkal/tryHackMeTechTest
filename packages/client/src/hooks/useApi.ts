import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { getCodeSandboxHost } from '@codesandbox/utils';

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
    ? `https://${codeSandboxHost}`
    : 'http://localhost:3001';

/**
 * Fetches data from the API.
 * @param endpoint The API endpoint to fetch from.
 * @param query The search query to pass to the API.
 * @returns An object with three properties:
 *   - `data`: The fetched data.
 *   - `loading`: Whether the data is currently being fetched.
 *   - `error`: An error message if something went wrong.
 */
export function useApi<T>(endpoint: string, query: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const fetchData = async () => {
            if (!debouncedQuery) {
                setData([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('fetching...', API_URL, endpoint, debouncedQuery);

                const response = await fetch(
                    `${API_URL}${endpoint}?search=${debouncedQuery}`
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();

                setData(result);
            } catch (err) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, debouncedQuery]);

    return { data, loading, error };
}
