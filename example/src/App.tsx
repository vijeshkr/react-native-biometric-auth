import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { BiometricAuth } from 'react-native-biometric-auth';

export default function App() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('Idle');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const available = await BiometricAuth.isBiometricAvailable();
      setIsAvailable(available);
    } catch (error: any) {
      setIsAvailable(false);
      setAuthStatus(`Check Error: ${error?.message || 'Unknown'}`);
    }
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    setAuthStatus('Authenticating...');
    try {
      const success = await BiometricAuth.authenticate({
        title: 'Biometric Verification',
        subtitle: 'Scan your fingerprint or enter device PIN',
        cancelText: 'Cancel',
        allowDeviceCredential: true,
      });

      if (success) {
        setAuthStatus('Success! Authentication passed.');
      } else {
        setAuthStatus('Failed! Authentication failed.');
      }
    } catch (error: any) {
      setAuthStatus(`Error: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.card}>
        <Text style={styles.title}>Biometric Auth Demo</Text>
        <Text style={styles.subtitle}>react-native-biometric-auth</Text>

        <View style={styles.statusBox}>
          <Text style={styles.label}>Hardware / PIN Available:</Text>
          <Text style={styles.value}>
            {isAvailable === null
              ? 'Checking...'
              : isAvailable
              ? 'YES ✅'
              : 'NO ❌'}
          </Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.label}>Authentication Status:</Text>
          <Text style={styles.statusText}>{authStatus}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuthenticate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Authenticate Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  statusText: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  button: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

