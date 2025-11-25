import { Store } from '../../../data/mockStores';

export interface StoreCardProps {
  store: Store;
  onPress: () => void;
}

export interface StoreSectionProps {
  title: string;
  stores: Store[];
  onStorePress: (store: Store) => void;
}