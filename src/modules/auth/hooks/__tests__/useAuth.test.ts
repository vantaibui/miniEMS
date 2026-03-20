import { createElement, type ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import { AuthContext, type AuthContextType } from '../../providers/AuthContext';
import { useAuth } from '../useAuth';

const buildAuthContextValue = (): AuthContextType => ({
  isAuthenticated: true,
  token: 'token',
  loading: false,
  login: jest.fn(async () => undefined),
  logout: jest.fn(async () => undefined),
});

describe('useAuth', () => {
  it('throws when used outside AuthContext provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );
  });

  it('returns auth context value when provider exists', () => {
    const value = buildAuthContextValue();
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(AuthContext.Provider, { value }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(value);
  });
});
