import { useEffect, useRef } from 'react';

/**
 * Hook to update the document title.
 * Restores the previous title on unmount.
 *
 * @param title - The title to set.
 * @param persistOnUnmount - If true, the title will not be restored on unmount.
 */
export function useDocumentTitle(title: string, persistOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Capture the initial title only once
    const originalTitle = defaultTitle.current;

    return () => {
      if (!persistOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [persistOnUnmount]);
}
