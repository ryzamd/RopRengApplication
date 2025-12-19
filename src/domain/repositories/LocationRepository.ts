import { DeliveryAddress } from '../entities/DeliveryAddress';

export interface LocationRepository {
  saveDefaultAddress(address: DeliveryAddress): Promise<void>;
  getDefaultAddress(): Promise<DeliveryAddress | null>;
  saveAddress(address: DeliveryAddress): Promise<void>;
  getAllAddresses(): Promise<DeliveryAddress[]>;
  deleteAddress(id: string): Promise<void>;
}