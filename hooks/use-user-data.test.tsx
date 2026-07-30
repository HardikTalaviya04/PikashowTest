// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserData } from './use-user-data';
import useSWR, { SWRConfig } from 'swr';
import React from 'react';

// We can mock global fetch
global.fetch = vi.fn();

describe('useUserData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>
      {children}
    </SWRConfig>
  );

  it('should return nullish data initially when uid is null', async () => {
    const { result } = renderHook(() => useUserData(null), { wrapper });

    // When key is null, SWR doesn't fetch, and it's false for isLoading
    expect(result.current.userData).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeUndefined();
  });

  it('should fetch data when uid is provided', async () => {
    const mockUser = { id: 'user123', name: 'Test User' };
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockUser,
    });

    const { result } = renderHook(() => useUserData('user123'), { wrapper });

    // Initially it is loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.userData).toEqual(mockUser);
    expect(result.current.isError).toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith('/api/user/user123');
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch');
    (global.fetch as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUserData('error-user'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBeDefined();
    expect(result.current.userData).toBeUndefined();
  });
});
