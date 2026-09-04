import { WishRequest } from '../../../core/models/wish.model';

export type WishCreateFieldErrors = Partial<Record<keyof WishRequest, string>>;
