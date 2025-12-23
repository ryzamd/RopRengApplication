import * as Location from 'expo-location';
import { AppError } from '../../core/errors/AppErrors';

export interface ILocationCoordinate {
  latitude: number;
  longitude: number;
}

export class LocationService {

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Lỗi khi xin quyền vị trí:', error);
      return false;
    }
  }

  async getCurrentPosition(): Promise<ILocationCoordinate> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      throw new AppError('Vui lòng cấp quyền truy cập vị trí để sử dụng tính năng này', 'PERMISSION_DENIED');
    }

    try {
      // Accuracy.High giúp lấy vị trí chính xác cho việc giao hàng
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      throw new AppError('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS.', 'LOCATION_SERVICE_ERROR');
    }
  }
}