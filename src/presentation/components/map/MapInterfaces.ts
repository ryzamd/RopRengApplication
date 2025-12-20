import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';

export interface MapViewProps {
  latitude: number;
  longitude: number;
  onRegionChange?: (region: { latitude: number; longitude: number }) => void;
  showUserLocation?: boolean;
  zoomLevel?: number;
}

export interface MapPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onConfirm: (address: DeliveryAddress) => void;
  onCancel: () => void;
}

export interface AddressSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: DeliveryAddress) => void;
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryAddressCardProps {
  address: DeliveryAddress | null;
  onEdit: () => void;
  showEditButton?: boolean;
}