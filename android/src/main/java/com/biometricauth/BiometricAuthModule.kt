package com.biometricauth

import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * BiometricAuthModule
 * 
 * Custom Android Native Module written in Kotlin.
 * Supports fingerprint scanning and device PIN / Pattern / Password fallback (GPay style).
 */
class BiometricAuthModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BiometricAuthModule"
    }

    /**
     * isBiometricAvailable()
     * 
     * Checks if fingerprint hardware or device PIN/Pattern security is set up on the phone.
     */
    @ReactMethod
    fun isBiometricAvailable(promise: Promise) {
        try {
            val biometricManager = BiometricManager.from(reactContext)
            
            // Allow Biometrics (Fingerprint/Face) OR Device Credentials (PIN/Pattern/Password)
            val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
                    BiometricManager.Authenticators.BIOMETRIC_WEAK or
                    BiometricManager.Authenticators.DEVICE_CREDENTIAL

            val canAuthenticateResult = biometricManager.canAuthenticate(authenticators)

            when (canAuthenticateResult) {
                BiometricManager.BIOMETRIC_SUCCESS -> {
                    promise.resolve(true)
                }
                BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                    promise.reject("NO_HARDWARE", "Device does not support biometrics or device credentials")
                }
                BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                    promise.reject("HW_UNAVAILABLE", "Biometric hardware is currently unavailable")
                }
                BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                    promise.reject("NONE_ENROLLED", "No fingerprint or device PIN/Pattern set up on this device")
                }
                else -> {
                    promise.reject("UNAVAILABLE", "Biometric authentication is unavailable")
                }
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.localizedMessage ?: "Unknown error occurred")
        }
    }

    /**
     * authenticate()
     * 
     * Launches system BiometricPrompt bottom sheet.
     * When allowDeviceCredential = true, Android displays "Use PIN" option on the dialog.
     * 
     * @param title Header title
     * @param subtitle Description text
     * @param cancelText Cancel button label (used when allowDeviceCredential = false)
     * @param allowDeviceCredential If true, enables fallback to device PIN / Pattern / Password (GPay style)
     * @param promise Promise resolved when fingerprint OR device PIN matches
     */
    @ReactMethod
    fun authenticate(
        title: String,
        subtitle: String,
        cancelText: String,
        allowDeviceCredential: Boolean,
        promise: Promise
    ) {
        val activity = reactContext.currentActivity as? FragmentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null or not a FragmentActivity")
            return
        }

        activity.runOnUiThread {
            try {
                val executor = ContextCompat.getMainExecutor(activity)

                val biometricPrompt = BiometricPrompt(
                    activity,
                    executor,
                    object : BiometricPrompt.AuthenticationCallback() {

                        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                            super.onAuthenticationSucceeded(result)
                            promise.resolve(true)
                        }

                        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                            super.onAuthenticationError(errorCode, errString)
                            promise.reject("BIOMETRIC_ERROR_$errorCode", errString.toString())
                        }

                        override fun onAuthenticationFailed() {
                            super.onAuthenticationFailed()
                        }
                    }
                )

                // Configure allowed authenticators:
                // Combining BIOMETRIC_STRONG | BIOMETRIC_WEAK | DEVICE_CREDENTIAL gives GPay style PIN fallback
                val authenticators = if (allowDeviceCredential) {
                    BiometricManager.Authenticators.BIOMETRIC_STRONG or
                            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                            BiometricManager.Authenticators.DEVICE_CREDENTIAL
                } else {
                    BiometricManager.Authenticators.BIOMETRIC_STRONG or
                            BiometricManager.Authenticators.BIOMETRIC_WEAK
                }

                val promptBuilder = BiometricPrompt.PromptInfo.Builder()
                    .setTitle(title)
                    .setSubtitle(subtitle)
                    .setAllowedAuthenticators(authenticators)

                // CRITICAL ANDROID RULE:
                // setNegativeButtonText() MUST NOT be called if DEVICE_CREDENTIAL is enabled,
                // because device PIN/Pattern takes the place of the cancel button on Android system UI.
                if (!allowDeviceCredential) {
                    promptBuilder.setNegativeButtonText(cancelText)
                }

                val promptInfo = promptBuilder.build()
                biometricPrompt.authenticate(promptInfo)

            } catch (e: Exception) {
                promise.reject("AUTH_FAILED", e.localizedMessage ?: "Failed to initiate biometric prompt")
            }
        }
    }
}
