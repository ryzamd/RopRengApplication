import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Alert, Linking, Platform } from 'react-native';

export interface PermissionStatusResult {
  location: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}

class PermissionService {
  private static instance: PermissionService;

  private constructor() {}

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  async requestInitialPermissions(): Promise<PermissionStatusResult> {
    console.log('🔍 [PermissionService] Starting initial permission check...');
    
    const locationGranted = await this.checkOrRequestLocation();
    const cameraGranted = await this.checkOrRequestCamera();
    const mediaGranted = await this.checkOrRequestMediaLibrary();

    const result = {
      location: locationGranted,
      camera: cameraGranted,
      mediaLibrary: mediaGranted,
    };

    console.log('✅ [PermissionService] Final Result:', JSON.stringify(result, null, 2));
    return result;
  }

  async checkOrRequestLocation(): Promise<boolean> {
    try {
      console.log('Checking Location permission...');
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'granted') {
        console.log('--> Location: ALREADY GRANTED');
        return true;
      }

      console.log('--> Location: Requesting user permission...');
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      
      const isGranted = newStatus === 'granted';
      console.log(`--> Location: ${isGranted ? 'GRANTED' : 'DENIED'} by user`);
      
      return isGranted;
    } catch (error) {
      console.error('❌ [PermissionService] Error requesting location:', error);
      return false;
    }
  }

  async checkOrRequestCamera(): Promise<boolean> {
    try {
      console.log('Checking Camera permission...');
      const { status } = await Camera.getCameraPermissionsAsync();
      
      if (status === 'granted') {
        console.log('--> Camera: ALREADY GRANTED');
        return true;
      }

      console.log('--> Camera: Requesting user permission...');
      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
      
      const isGranted = newStatus === 'granted';
      console.log(`--> Camera: ${isGranted ? 'GRANTED' : 'DENIED'} by user`);
      
      return isGranted;
    } catch (error) {
      console.error('❌ [PermissionService] Error requesting camera:', error);
      return false;
    }
  }

  async checkOrRequestMediaLibrary(): Promise<boolean> {
    try {
      console.log('Checking Media Library permission...');
      const { status } = await MediaLibrary.getPermissionsAsync();
      
      if (status === 'granted') {
        console.log('--> Media Library: ALREADY GRANTED');
        return true;
      }

      console.log('--> Media Library: Requesting user permission...');
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      
      const isGranted = newStatus === 'granted';
      console.log(`--> Media Library: ${isGranted ? 'GRANTED' : 'DENIED'} by user`);
      
      return isGranted;
    } catch (error) {
      console.error('❌ [PermissionService] Error requesting media library:', error);
      return false;
    }
  }

  openSettings() {
    console.log('Opening App Settings...');
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }
}

export const permissionService = PermissionService.getInstance();