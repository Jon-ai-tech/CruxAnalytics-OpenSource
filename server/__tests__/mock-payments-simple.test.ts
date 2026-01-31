import { describe, it, expect } from 'vitest';

describe('Mock Payments Configuration', () => {
  it('should have mock payments enabled in test environment', () => {
    // This test verifies the setup.ts file set the env var
    expect(process.env.EXPO_PUBLIC_USE_MOCK_PAYMENTS).toBe('true');
  });

  it('should be running in test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
