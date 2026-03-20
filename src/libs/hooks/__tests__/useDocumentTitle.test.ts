import { renderHook } from '@testing-library/react';

import { useDocumentTitle } from '../useDocumentTitle';

describe('useDocumentTitle', () => {
  const originalTitle = 'Initial title';

  beforeEach(() => {
    document.title = originalTitle;
  });

  it('sets document title', () => {
    renderHook(() => useDocumentTitle('Dashboard'));

    expect(document.title).toBe('Dashboard');
  });

  it('restores previous title on unmount by default', () => {
    const { unmount } = renderHook(() => useDocumentTitle('Users'));
    expect(document.title).toBe('Users');

    unmount();

    expect(document.title).toBe(originalTitle);
  });

  it('keeps latest title on unmount when persistOnUnmount is true', () => {
    const { unmount } = renderHook(() => useDocumentTitle('Settings', true));
    expect(document.title).toBe('Settings');

    unmount();

    expect(document.title).toBe('Settings');
  });
});
