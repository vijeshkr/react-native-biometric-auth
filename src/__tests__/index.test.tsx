import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { NativeModules, Platform } from 'react-native';
import { BiometricAuth } from '../index';

describe('BiometricAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
  });

  it('checks if biometric is available on Android', async () => {
    NativeModules.BiometricAuthModule = {
      isBiometricAvailable: (jest.fn() as any).mockResolvedValue(true),
    };

    const isAvailable = await BiometricAuth.isBiometricAvailable();
    expect(isAvailable).toBe(true);
    expect(NativeModules.BiometricAuthModule.isBiometricAvailable).toHaveBeenCalled();
  });

  it('returns false for non-Android platforms', async () => {
    Platform.OS = 'ios';
    const isAvailable = await BiometricAuth.isBiometricAvailable();
    expect(isAvailable).toBe(false);
  });

  it('calls authenticate on Android with correct parameters', async () => {
    Platform.OS = 'android';
    NativeModules.BiometricAuthModule = {
      authenticate: (jest.fn() as any).mockResolvedValue(true),
    };

    const success = await BiometricAuth.authenticate({
      title: 'Custom Title',
      subtitle: 'Custom Subtitle',
      cancelText: 'Cancel',
      allowDeviceCredential: true,
    });

    expect(success).toBe(true);
    expect(NativeModules.BiometricAuthModule.authenticate).toHaveBeenCalledWith(
      'Custom Title',
      'Custom Subtitle',
      'Cancel',
      true
    );
  });
});

