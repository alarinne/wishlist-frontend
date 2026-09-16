import { CategoryRequest } from '../../../core/models/category.model';

export type CategoryCreateFieldErrors = Partial<Record<keyof CategoryRequest, string>>;
