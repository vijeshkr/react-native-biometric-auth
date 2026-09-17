import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  isBiometricAvailable(): Promise<boolean>;
  authenticate(
    title: string,
    subtitle: string,
    cancelText: string,
    allowDeviceCredential: boolean
  ): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('BiometricAuthModule');

