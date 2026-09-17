# react-native-biometric-auth

High-performance Android biometric fingerprint authentication module with device PIN and pattern fallback for React Native.

## Features

- ⚡️ Pure Kotlin Android Native Module using `androidx.biometric:biometric`
- 🔒 Supports Fingerprint scan and device PIN / Pattern / Password fallback (Google Pay style)
- 🚀 Simple, promise-based React Native API
- 📱 Modern TypeScript definitions included

## Installation

```sh
npm install react-native-biometric-auth
# or
yarn add react-native-biometric-auth
```

## Usage

```tsx
import { BiometricAuth } from 'react-native-biometric-auth';

// 1. Check if biometrics or PIN/Pattern is available on device
const checkAvailability = async () => {
  try {
    const isAvailable = await BiometricAuth.isBiometricAvailable();
    console.log('Biometric available:', isAvailable);
  } catch (error) {
    console.error('Biometric check failed:', error);
  }
};

// 2. Prompt for authentication
const authenticateUser = async () => {
  try {
    const success = await BiometricAuth.authenticate({
      title: 'Unlock Application',
      subtitle: 'Touch fingerprint sensor or enter device PIN',
      cancelText: 'Cancel',
      allowDeviceCredential: true, // Enables GPay style PIN/Pattern fallback
    });

    if (success) {
      console.log('Authenticated successfully!');
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
};
```

## API Reference

### `BiometricAuth.isBiometricAvailable()`
Returns `Promise<boolean>`. Resolves to `true` if biometric hardware or device credential (PIN/Pattern/Password) is enrolled and ready.

### `BiometricAuth.authenticate(options?: AuthenticateOptions)`
Returns `Promise<boolean>`. Launches system `BiometricPrompt` dialog.

#### `AuthenticateOptions`
| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `'Unlock App'` | Title shown at top of native prompt |
| `subtitle` | `string` | `'Touch fingerprint sensor or enter PIN'` | Subtitle description text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text (used when `allowDeviceCredential: false`) |
| `allowDeviceCredential` | `boolean` | `true` | Allows device PIN/Pattern/Password fallback |

## License

MIT

