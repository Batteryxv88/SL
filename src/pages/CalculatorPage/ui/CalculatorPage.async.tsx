import { lazy } from 'react';

export const CalculatorPageAsync = lazy(() => import('./CalculatorPage').then(module => ({ default: module.default }))); 