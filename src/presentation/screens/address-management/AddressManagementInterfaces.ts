import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';


export interface AddressManagementScreenProps {}

export interface AddressItemProps {
  address: DeliveryAddress;
  onSetDefault: (id: string) => void;
  onEdit: (address: DeliveryAddress) => void;
  onDelete: (id: string) => void;
}

export interface AddressLabelModalProps {
  visible: boolean;
  initialLabel?: string;
  onSave: (label: string) => void;
  onCancel: () => void;
}