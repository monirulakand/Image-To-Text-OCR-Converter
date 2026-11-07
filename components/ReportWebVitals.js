'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Replaces the CRA `reportWebVitals` helper with the Next.js-native hook.
 * Pass `console.log` to forward the metrics in development.
 */
export default function ReportWebVitals() {
  useReportWebVitals((metric) => {
    console.log('[web-vitals]', metric);
  });

  return null;
}
