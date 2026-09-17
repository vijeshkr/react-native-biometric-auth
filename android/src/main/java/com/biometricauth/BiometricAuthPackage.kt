package com.biometricauth

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * BiometricAuthPackage
 * 
 * Every custom Native Module in React Native must be bundled inside a ReactPackage.
 * The package acts as a registry that tells React Native which modules are available.
 */
class BiometricAuthPackage : ReactPackage {

    /**
     * createNativeModules()
     * 
     * Registers non-UI native modules (like our BiometricAuthModule) with React Native.
     * React Native calls this method when initializing the application.
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(BiometricAuthModule(reactContext))
    }

    /**
     * createViewManagers()
     * 
     * Registers native UI views (like custom native camera views, maps, video players).
     * Since BiometricAuthModule is a logic-only module (no custom native UI view), we return an empty list.
     */
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
