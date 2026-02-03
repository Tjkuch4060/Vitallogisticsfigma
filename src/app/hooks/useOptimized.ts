import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Performance optimization hooks
 */

/**
 * Stable callback that doesn't change between renders
 * Use this for event handlers passed to child components
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(((...args) => {
    return callbackRef.current(...args);
  }) as T, []);
}

/**
 * Debounced value
 * Updates the value only after the specified delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Previous value hook
 * Returns the value from the previous render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Mount detection
 * Returns true only on first render
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}

/**
 * Lazy initialization
 * Only computes value once on first render
 */
export function useLazyMemo<T>(factory: () => T): T {
  return useMemo(factory, []); // eslint-disable-line react-hooks/exhaustive-deps
}
