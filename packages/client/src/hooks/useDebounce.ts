import { useState, useEffect } from 'react';

/**
 * useDebounce
 * @description Hook that debounces a value change by some time.
 * @param value The value to debounce.
 * @param delay The amount of time to debounce by.
 * @returns The debounced value.
 * @example
 * const debouncedValue = useDebounce(someValue, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
