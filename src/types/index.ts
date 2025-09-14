export interface Provider {
  id: string;
  name: string;
  type: 'pharmacy' | 'doctor' | 'clinic' | 'hospital' | 'tradipractitioner';
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
}

export type ServiceType = 'pharmacy' | 'doctor' | 'clinic' | 'hospital' | 'tradipractitioner';