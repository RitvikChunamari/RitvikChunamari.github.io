import React from 'react';

export type MonumentType = 'gateway' | 'csmt' | 'sealink' | 'pagoda';

interface MonumentProps extends React.ComponentProps<'svg'> {
  type: MonumentType;
  className?: string;
  style?: React.CSSProperties;
}

export function Monument({ type, ...props }: MonumentProps) {
  switch (type) {
    case 'gateway':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
          {/* Gateway of India - Improved Realistic Silhouette */}
          <path fillRule="evenodd" d="M 5 90 L 5 86 L 10 86 L 10 46 L 8 46 L 8 43 L 10 43 L 10 38 L 12 38 L 12 32 C 12 24, 18 24, 18 32 L 18 38 L 32 38 L 32 25 C 32 17, 38 17, 38 25 L 38 38 L 42 38 L 42 22 C 42 8, 58 8, 58 22 L 58 38 L 62 38 L 62 25 C 62 17, 68 17, 68 25 L 68 38 L 82 38 L 82 32 C 82 24, 88 24, 88 32 L 88 38 L 90 38 L 90 43 L 92 43 L 92 46 L 90 46 L 90 86 L 95 86 L 95 90 Z M 35 90 L 35 55 A 15 15 0 0 1 65 55 L 65 90 Z M 16 90 L 16 65 A 6 6 0 0 1 28 65 L 28 90 Z M 72 90 L 72 65 A 6 6 0 0 1 84 65 L 84 90 Z M 17 57 L 17 51 L 19 51 L 19 57 Z M 21 57 L 21 51 L 23 51 L 23 57 Z M 25 57 L 25 51 L 27 51 L 27 57 Z M 73 57 L 73 51 L 75 51 L 75 57 Z M 77 57 L 77 51 L 79 51 L 79 57 Z M 81 57 L 81 51 L 83 51 L 83 57 Z M 10 46 L 90 46 L 90 48 L 10 48 Z M 10 43 L 90 43 L 90 44.5 L 10 44.5 Z M 10 38 L 90 38 L 90 40 L 10 40 Z M 38 32 L 62 32 L 62 35 L 38 35 Z M 42 26 L 58 26 L 58 29 L 42 29 Z M 11 32 L 19 32 L 19 33 L 11 33 Z M 31 25 L 39 25 L 39 26 L 31 26 Z M 41 22 L 59 22 L 59 23 L 41 23 Z M 61 25 L 69 25 L 69 26 L 61 26 Z M 81 32 L 89 32 L 89 33 L 81 33 Z M 14 86 L 14 48 L 15 48 L 15 86 Z M 31 86 L 31 48 L 32 48 L 32 86 Z M 68 86 L 68 48 L 69 48 L 69 86 Z M 85 86 L 85 48 L 86 48 L 86 86 Z" />
        </svg>
      );
    case 'csmt':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
          {/* CSMT - Accurate Victorian Gothic Silhouette */}
          <path fillRule="evenodd" d="M 5 90 L 95 90 L 95 65 L 85 65 L 85 55 L 78 55 L 78 60 L 68 60 L 68 45 L 62 45 L 62 40 Q 62 25 50 15 Q 38 25 38 40 L 38 45 L 32 45 L 32 60 L 22 60 L 22 55 L 15 55 L 15 65 L 5 65 Z M 42 90 L 42 70 A 8 8 0 0 1 58 70 L 58 90 Z M 25 90 L 25 75 A 4 4 0 0 1 33 75 L 33 90 Z M 67 90 L 67 75 A 4 4 0 0 1 75 75 L 75 90 Z M 15 55 Q 18.5 45 22 55 Z M 78 55 Q 81.5 45 85 55 Z M 46 52 A 4 4 0 1 0 54 52 A 4 4 0 1 0 46 52 Z M 49 15 L 51 15 L 51 5 L 49 5 Z M 46 8 L 54 8 L 54 6 L 46 6 Z" />
        </svg>
      );
    case 'sealink':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
          {/* Bandra-Worli Sea Link - Accurate Cable-Stayed Structure */}
          <path fillRule="evenodd" d="M 0 85 L 100 85 L 100 80 L 0 80 Z M 20 80 L 32 45 L 28 35 L 35 10 L 42 35 L 38 45 L 50 80 L 42 80 L 35 60 L 28 80 Z M 35 18 L 31 35 L 39 35 Z M 32 42 L 38 42 L 35 52 Z M 60 80 L 68 50 L 65 42 L 70 20 L 75 42 L 72 50 L 80 80 L 74 80 L 70 65 L 66 80 Z M 70 28 L 67 42 L 73 42 Z M 68 48 L 72 48 L 70 56 Z" />
          <path d="M 35 15 L 5 80 M 35 20 L 10 80 M 35 25 L 15 80 M 35 30 L 20 80 M 35 15 L 65 80 M 35 20 L 60 80 M 35 25 L 55 80 M 35 30 L 50 80 M 70 25 L 45 80 M 70 30 L 50 80 M 70 35 L 55 80 M 70 40 L 60 80 M 70 25 L 95 80 M 70 30 L 90 80 M 70 35 L 85 80 M 70 40 L 80 80" stroke="var(--monument-color)" strokeWidth="0.5" fill="none" />
        </svg>
      );
    case 'pagoda':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
          {/* Global Vipassana Pagoda - Accurate Shwedagon-style Dome */}
          <path fillRule="evenodd" d="M 10 90 L 90 90 L 90 85 L 85 85 C 85 65, 75 55, 60 40 C 55 35, 52 25, 52 15 L 48 15 C 48 25, 45 35, 40 40 C 25 55, 15 65, 15 85 L 10 85 Z M 40 90 L 60 90 L 60 75 A 10 10 0 0 0 40 75 Z M 17 80 L 83 80 L 83 78 L 17 78 Z M 20 70 L 80 70 L 80 68 L 20 68 Z M 25 60 L 75 60 L 75 58 L 25 58 Z M 32 50 L 68 50 L 68 48 L 32 48 Z M 40 40 L 60 40 L 60 38 L 40 38 Z" />
          <path d="M 50 15 L 50 2 M 45 10 L 55 10 M 47 7 L 53 7 M 48 4 L 52 4" stroke="var(--monument-color)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}
