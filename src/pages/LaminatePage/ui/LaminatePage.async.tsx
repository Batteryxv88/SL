import { lazy } from 'react';

export const LaminatePageAsync = lazy(() => import('./LaminatePage').then(module => ({ default: module.default }))); 