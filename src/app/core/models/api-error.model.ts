export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  fieldErrors: ApiFieldError[];
}
