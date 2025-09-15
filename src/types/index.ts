export interface Provider {
  id: string;
  name: string;
  type: 'pharmacy' | 'doctor' | 'clinic' | 'hospital' | 'tradipractitioner' | 'delivery';
  description: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
  services: string[];
  isOpen: boolean;
  image?: string;
  deliveryFee?: number;
  estimatedTime?: string;
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  userName: string;
  reason: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  paymentMethod?: PaymentMethod;
  deliveryAddress?: string;
  totalAmount?: number;
}

export type ServiceType = 'pharmacy' | 'doctor' | 'clinic' | 'hospital' | 'tradipractitioner' | 'delivery';

export type PaymentMethod = 'airtel-money' | 'moov-money' | 'cash';

export interface DeliveryRequest {
  id: string;
  pharmacyId: string;
  deliveryPersonId: string;
  medications: Medication[];
  deliveryAddress: string;
  customerPhone: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'accepted' | 'picking-up' | 'delivering' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  quantity: number;
  price: number;
  prescription?: string;
}