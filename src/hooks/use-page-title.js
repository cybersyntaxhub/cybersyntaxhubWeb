import { useEffect } from 'react';

// Sets document.title for a page, then restores the previous title on unmount.
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — CyberSyntax Hub` : 'CyberSyntax Hub';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
