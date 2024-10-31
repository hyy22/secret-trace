interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
}
type ResponseData<T> = T extends ApiResponse ? T['data'] : T;