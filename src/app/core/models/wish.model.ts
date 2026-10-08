export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type WishStatus = 'ACTIVE' | 'PURCHASED';

export interface WishRequest {
  wishName: string;
  wishPrice: number;
  url?: string | null;
  categoryId: number;
  priority: Priority;
}

export interface WishStatusUpdateRequest {
  status: WishStatus;
}

export interface WishResponse {
  id: number;
  wishName: string;
  wishPrice: number;
  url: string | null;
  status: WishStatus;
  categoryId: number;
  categoryName: string;
  priority: Priority;
}
