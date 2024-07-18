/**
 * @file useIsomorphicLayoutEffect.js
 * Hook to suppress useLayoutEffect error on SSR.
 */

import { useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export { useIsomorphicLayoutEffect as useLayoutEffect };
