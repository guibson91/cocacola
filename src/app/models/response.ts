import { User } from "./user";

export interface ResponseHeaders {
  "x-maintenance-total"?: string;
  "x-maintenance-partial"?: string;
}

export interface Response<T> {
  httpStatus: number;
  message: string;
  status: boolean;
  data: T;
  maintenanceParcial?: boolean;
  maintenanceTotal?: boolean;
}

export interface AuthResponse {
  httpStatus: number;
  message: string;
  status: boolean;
  user: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  error_description?: string;
}

export interface ProductResponse<T> {
  items?: T;
  pagination?: {
    overallCount: number;
    totalPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  error?: string;
  error_description?: string;
}
