import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';

export class AddressManagementService {

  static sortAddresses(addresses: DeliveryAddress[]): DeliveryAddress[] {
    return [...addresses].sort((a, b) => {
      // Default address always first
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      
      // Sort by ID (newer first - assuming ID contains timestamp)
      return b.id.localeCompare(a.id);
    });
  }

  static validateLabel(label: string): { valid: boolean; error?: string } {
    const trimmed = label.trim();
    
    if (trimmed.length === 0) {
      return { valid: false, error: 'Vui lòng nhập tên địa chỉ' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: 'Tên địa chỉ quá dài (tối đa 50 ký tự)' };
    }
    
    return { valid: true };
  }

  static formatAddressPreview(address: string, maxLength: number = 50): string {
    if (address.length <= maxLength) {
      return address;
    }
    
    return address.substring(0, maxLength) + '...';
  }

  static getSuggestedLabels(): string[] {
    return ['Nhà riêng', 'Công ty', 'Nhà bạn bè', 'Khác'];
  }
}