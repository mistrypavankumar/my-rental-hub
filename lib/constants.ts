export interface LoginProps {
  email: string;
  password: string;
}

export interface AdminProps {
  id: string;
  name: string;
  email: string;
  role: string;
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
  _id: string;
  adminId: string;
  name: string;
  address: Address;
  ownerName: string;
  ownerPhone: string;
  defaultPrice: number;
  utilitiesIncluded: boolean;
  paymentDueDate: string;
  lateFeePerDay: number;
  rooms: number;
  tenants: [];
  roomStatus: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  utilitiesIncluded: boolean;
  paymentDueDate: string;
  lateFeePerDay: number;
  rooms: number;
  singleRoomRent: number;
  sharedRoomRent: number;
}
