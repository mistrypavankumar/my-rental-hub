export interface LoginProps {
  email: string;
  password: string;
}

export interface AdminProps {
  id: string;
  name: string;
  email: string;
  role: string;
  houses: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponseProps {
  message: string;
  admin: AdminProps;
}

export interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

export const PUBLIC_ROUTES = ["/", "/login", "/register"];

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface House {
  _id?: string;
  adminId?: string;
  name: string;
  address: Address;
  ownerName: string;
  ownerPhone: string;
  defaultPrice: number;
  utilitiesIncluded?: boolean;
  paymentDueDate: string;
  lateFeePerDay: number;
  rooms: number;
  tenants?: [];
  roomStatus?: [];
  singleRoomRent: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface MemberProps {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  houseId: string;
  utilitiesApplied?: boolean;
  houseRentApplied?: boolean;
  isStayHalfMonth?: boolean;
  role?: "owner" | "tenant";
  stayInSharedRoom?: boolean;
  joinedAt?: Date;
  updatedAt?: Date;
}

export interface RentProps {
  _id?: string;
  houseId: string;
  month: string;
  houseRent: number;
  gas: number;
  electricity: number;
  internet: number;
  water: number;
  totalRent: number;
  splitAmount?: number;
  lateFeeApplied?: boolean;
  lateFeeAmount?: number;
  reasonForLateFee?: string;
  isRentGenerated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HouseRequest {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ownerName: string;
  ownerPhone: string;
  defaultPrice: number;
  utilitiesIncluded?: boolean;
  paymentDueDate: string;
  lateFeePerDay: number;
  rooms: number;
  singleRoomRent: number;
}

export interface PaymentProps {
  _id?: string;
  memberId: string;
  houseId: string;
  rentId: string;
  houseRent: number;
  gas: number;
  electricity: number;
  internet: number;
  water: number;
  totalRent?: number;
  paidAmount?: number;
  remainingAmount?: number;
  utilitiesApplied?: boolean;
  paid: boolean;
  paidDate?: string; // ISO string format
  notified?: boolean;
  createdAt?: string; // ISO string format
  __v?: number;
}

export interface PaymentHistoryProps {
  paymentId: string;
  memberId: string;
  rentId: string;
  paidAmount: number;
  remainingAmount: number;
  createdAt?: string; // ISO string format
  updatedAt?: string; // ISO string format
}
