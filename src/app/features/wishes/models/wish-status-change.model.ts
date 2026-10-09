import { WishStatusUpdateRequest } from '../../../core/models/wish.model';

export interface WishStatusChange extends WishStatusUpdateRequest {
  id: number;
}
