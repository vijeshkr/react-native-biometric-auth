import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-biometric-auth' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n';

const BiometricAuthModule: any = new Proxy(
  {},
  {
    get(_target, prop) {
      const module = NativeModules.BiometricAuthModule;
      if (module) {
        return module[prop];
      }
      throw new Error(LINKING_ERROR);
    },
  }
);

export interface AuthenticateOptions {
  title?: string;
  subtitle?: string;
  cancelText?: string;
  allowDeviceCredential?: boolean;
}

export class BiometricAuth {
  static async isBiometricAvailable(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    return BiometricAuthModule.isBiometricAvailable();
  }

  static async authenticate(options: AuthenticateOptions = {}): Promise<boolean> {
    const {
      title = 'Unlock App',
      subtitle = 'Touch fingerprint sensor or enter PIN',
      cancelText = 'Cancel',
      allowDeviceCredential = true,
    } = options;

    if (Platform.OS !== 'android') {
      throw new Error('BiometricAuth is currently supported on Android.');
    }

    return BiometricAuthModule.authenticate(
      title,
      subtitle,
      cancelText,
      allowDeviceCredential
    );
  }
}

export const isBiometricAvailable = BiometricAuth.isBiometricAvailable;
export const authenticate = BiometricAuth.authenticate;

export default BiometricAuth;

