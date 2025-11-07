export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  imageUrl: string;
  badge?: 'NEW' | 'HOT';
  discount?: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'new', name: 'Món Mới Phải Thử', icon: '🆕' },
  { id: 'espresso', name: 'Espresso', icon: '☕' },
  { id: 'capphe', name: 'Cà Phê Phin', icon: '☕' },
  { id: 'matcha', name: 'Matcha', icon: '🍵' },
  { id: 'tra', name: 'Trà', icon: '🍵' },
  { id: 'americano', name: 'Americano', icon: '☕' },
  { id: 'latte', name: 'Latte', icon: '☕' },
  { id: 'coldbrew', name: 'Cold Brew', icon: '🧊' },
  { id: 'frappe', name: 'Frappe', icon: '🥤' },
  { id: 'combo', name: 'Combo', icon: '🎁' },
];

export const MOCK_PRODUCTS: Product[] = [
  // Món Mới (10 items)
  { id: '1', name: 'Trà Sen Tuyết', price: 45000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/FFB6C1/000?text=Tra+Sen+Tuyet', badge: 'NEW' },
  { id: '2', name: 'Trà Sen Yến Mạch', price: 49000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/FFE4E1/000?text=Tra+Sen+Yen', badge: 'NEW' },
  { id: '3', name: 'Trà Sen Mây', price: 42000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/FFC0CB/000?text=Tra+Sen+May', badge: 'NEW' },
  { id: '4', name: 'Trà Sen Vải', price: 47000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/FFB6D9/000?text=Tra+Sen+Vai', badge: 'NEW' },
  { id: '5', name: 'Cà Phê Dừa Nướng', price: 52000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/D2691E/FFF?text=CP+Dua', badge: 'NEW' },
  { id: '6', name: 'Matcha Đậu Đỏ', price: 55000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/90EE90/000?text=Matcha+Dau', badge: 'NEW' },
  { id: '7', name: 'Trà Đào Cam Sả', price: 48000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/FFE4B5/000?text=Tra+Dao', badge: 'NEW' },
  { id: '8', name: 'Cà Phê Sữa Hạt Dẻ', price: 51000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=CP+Hat+De', badge: 'NEW' },
  { id: '9', name: 'Trà Ô Long Sữa', price: 46000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/F5DEB3/000?text=O+Long', badge: 'NEW' },
  { id: '10', name: 'Matcha Kem Cheese', price: 58000, categoryId: 'new', imageUrl: 'https://via.placeholder.com/200x200/98FB98/000?text=Matcha+Kem', badge: 'NEW' },

  // Espresso (5 items)
  { id: '11', name: 'Espresso Đơn', price: 35000, categoryId: 'espresso', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Espresso' },
  { id: '12', name: 'Espresso Đôi', price: 45000, categoryId: 'espresso', imageUrl: 'https://via.placeholder.com/200x200/654321/FFF?text=Espresso+Doi' },
  { id: '13', name: 'Espresso Macchiato', price: 42000, categoryId: 'espresso', imageUrl: 'https://via.placeholder.com/200x200/A0522D/FFF?text=Macchiato' },
  { id: '14', name: 'Espresso Con Panna', price: 44000, categoryId: 'espresso', imageUrl: 'https://via.placeholder.com/200x200/CD853F/000?text=Con+Panna' },
  { id: '15', name: 'Ristretto', price: 38000, categoryId: 'espresso', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Ristretto' },

  // Cà Phê Phin (5 items)
  { id: '16', name: 'Cà Phê Phin Sữa Đá', price: 39000, categoryId: 'capphe', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Phin+Sua' },
  { id: '17', name: 'Cà Phê Phin Đen', price: 35000, categoryId: 'capphe', imageUrl: 'https://via.placeholder.com/200x200/000000/FFF?text=Phin+Den' },
  { id: '18', name: 'Bạc Xỉu', price: 42000, categoryId: 'capphe', imageUrl: 'https://via.placeholder.com/200x200/D2B48C/000?text=Bac+Xiu' },
  { id: '19', name: 'Cà Phê Sữa Nóng', price: 38000, categoryId: 'capphe', imageUrl: 'https://via.placeholder.com/200x200/A0522D/FFF?text=Sua+Nong' },
  { id: '20', name: 'Cà Phê Đen Nóng', price: 34000, categoryId: 'capphe', imageUrl: 'https://via.placeholder.com/200x200/2F4F4F/FFF?text=Den+Nong' },

  // Matcha (5 items)
  { id: '21', name: 'Matcha Latte', price: 52000, categoryId: 'matcha', imageUrl: 'https://via.placeholder.com/200x200/90EE90/000?text=Matcha+Latte' },
  { id: '22', name: 'Matcha Đá Xay', price: 55000, categoryId: 'matcha', imageUrl: 'https://via.placeholder.com/200x200/98FB98/000?text=Matcha+Xay' },
  { id: '23', name: 'Matcha Nóng', price: 50000, categoryId: 'matcha', imageUrl: 'https://via.placeholder.com/200x200/8FBC8F/FFF?text=Matcha+Nong' },
  { id: '24', name: 'Matcha Sữa Tươi', price: 56000, categoryId: 'matcha', imageUrl: 'https://via.placeholder.com/200x200/7CFC00/000?text=Matcha+Tuoi' },
  { id: '25', name: 'Matcha Cream', price: 58000, categoryId: 'matcha', imageUrl: 'https://via.placeholder.com/200x200/ADFF2F/000?text=Matcha+Cream' },

  // Trà (10 items)
  { id: '26', name: 'Trà Đào', price: 45000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/FFB6C1/000?text=Tra+Dao' },
  { id: '27', name: 'Trà Vải', price: 43000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/FF69B4/FFF?text=Tra+Vai' },
  { id: '28', name: 'Trá Chanh', price: 40000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/FFFACD/000?text=Tra+Chanh' },
  { id: '29', name: 'Trà Xanh', price: 38000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/90EE90/000?text=Tra+Xanh' },
  { id: '30', name: 'Trà Sữa Truyền Thống', price: 46000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/F5DEB3/000?text=Tra+Sua' },
  { id: '31', name: 'Trà Hoa Cúc', price: 41000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/FAFAD2/000?text=Tra+Cuc' },
  { id: '32', name: 'Trà Gừng', price: 39000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/DAA520/FFF?text=Tra+Gung' },
  { id: '33', name: 'Trà Atiso', price: 37000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/CD853F/FFF?text=Tra+Atiso' },
  { id: '34', name: 'Trà Ô Long', price: 44000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/D2691E/FFF?text=O+Long' },
  { id: '35', name: 'Trà Hoa Nhài', price: 42000, categoryId: 'tra', imageUrl: 'https://via.placeholder.com/200x200/F0E68C/000?text=Tra+Nhai' },

  // Americano (5 items)
  { id: '36', name: 'Ethiopia Americano', price: 39000, originalPrice: 69000, categoryId: 'americano', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Ethiopia', discount: '-30,000đ' },
  { id: '37', name: 'Ethiopia Americano Nóng', price: 39000, originalPrice: 69000, categoryId: 'americano', imageUrl: 'https://via.placeholder.com/200x200/A0522D/FFF?text=Ethiopia+Nong', discount: '-30,000đ' },
  { id: '38', name: 'Americano Đá', price: 42000, categoryId: 'americano', imageUrl: 'https://via.placeholder.com/200x200/654321/FFF?text=Americano' },
  { id: '39', name: 'Americano Nóng', price: 40000, categoryId: 'americano', imageUrl: 'https://via.placeholder.com/200x200/4B3621/FFF?text=Ame+Nong' },
  { id: '40', name: 'Long Black', price: 44000, categoryId: 'americano', imageUrl: 'https://via.placeholder.com/200x200/2F4F4F/FFF?text=Long+Black' },

  // Latte (5 items)
  { id: '41', name: 'Caffe Latte', price: 49000, categoryId: 'latte', imageUrl: 'https://via.placeholder.com/200x200/D2B48C/000?text=Latte' },
  { id: '42', name: 'Caramel Latte', price: 52000, categoryId: 'latte', imageUrl: 'https://via.placeholder.com/200x200/DEB887/000?text=Caramel' },
  { id: '43', name: 'Vanilla Latte', price: 51000, categoryId: 'latte', imageUrl: 'https://via.placeholder.com/200x200/F5DEB3/000?text=Vanilla' },
  { id: '44', name: 'Hazelnut Latte', price: 53000, categoryId: 'latte', imageUrl: 'https://via.placeholder.com/200x200/CD853F/000?text=Hazelnut' },
  { id: '45', name: 'Mocha Latte', price: 54000, categoryId: 'latte', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Mocha' },

  // Cold Brew (5 items)
  { id: '46', name: 'Cold Brew Truyền Thống', price: 45000, categoryId: 'coldbrew', imageUrl: 'https://via.placeholder.com/200x200/2F4F4F/FFF?text=Cold+Brew' },
  { id: '47', name: 'Cold Brew Sữa Tươi', price: 50000, categoryId: 'coldbrew', imageUrl: 'https://via.placeholder.com/200x200/696969/FFF?text=CB+Sua' },
  { id: '48', name: 'Cold Brew Phúc Bồn Tử', price: 52000, categoryId: 'coldbrew', imageUrl: 'https://via.placeholder.com/200x200/8B008B/FFF?text=CB+Phuc' },
  { id: '49', name: 'Cold Brew Cam', price: 51000, categoryId: 'coldbrew', imageUrl: 'https://via.placeholder.com/200x200/FFA500/000?text=CB+Cam' },
  { id: '50', name: 'Cold Brew Trân Châu', price: 55000, categoryId: 'coldbrew', imageUrl: 'https://via.placeholder.com/200x200/4B0082/FFF?text=CB+Tran+Chau' },

  // Frappe (5 items)
  { id: '51', name: 'Caramel Frappe', price: 55000, categoryId: 'frappe', imageUrl: 'https://via.placeholder.com/200x200/DEB887/000?text=Caramel+Fr' },
  { id: '52', name: 'Mocha Frappe', price: 56000, categoryId: 'frappe', imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Mocha+Fr' },
  { id: '53', name: 'Cookies & Cream Frappe', price: 58000, categoryId: 'frappe', imageUrl: 'https://via.placeholder.com/200x200/000000/FFF?text=Cookies+Fr' },
  { id: '54', name: 'Matcha Frappe', price: 57000, categoryId: 'frappe', imageUrl: 'https://via.placeholder.com/200x200/90EE90/000?text=Matcha+Fr' },
  { id: '55', name: 'Chocolate Frappe', price: 55000, categoryId: 'frappe', imageUrl: 'https://via.placeholder.com/200x200/654321/FFF?text=Choco+Fr' },

  // Combo (5 items)
  { id: '56', name: 'Combo Cà Phê & Bánh Mì', price: 54000, originalPrice: 68000, categoryId: 'combo', imageUrl: 'https://via.placeholder.com/200x200/FFD700/000?text=Combo+1', discount: '20%' },
  { id: '57', name: 'Combo Matcha & Bánh Mì', price: 59000, originalPrice: 69000, categoryId: 'combo', imageUrl: 'https://via.placeholder.com/200x200/FFE4B5/000?text=Combo+2', discount: '15%' },
  { id: '58', name: 'Combo Trà Bánh', price: 64000, originalPrice: 88000, categoryId: 'combo', imageUrl: 'https://via.placeholder.com/200x200/FFF8DC/000?text=Combo+3', discount: '25%' },
  { id: '59', name: 'Combo Pasta & Nước', price: 105000, originalPrice: 135000, categoryId: 'combo', imageUrl: 'https://via.placeholder.com/200x200/FFE4E1/000?text=Combo+4', discount: '22%' },
  { id: '60', name: 'Combo Sáng', price: 49000, originalPrice: 65000, categoryId: 'combo', imageUrl: 'https://via.placeholder.com/200x200/FFFACD/000?text=Combo+5', discount: '25%' },
];