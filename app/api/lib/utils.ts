import { type ValidationError } from "class-validator";

export function buildResponse<T>(success: boolean, data?: T, msg = 'success'): Response {
  return Response.json({
    success,
    data,
    message: msg,
  });
}
export function buildErrorMsg(errors: ValidationError[], stopAtFirst = true): string {
  let result = '';
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];
    if (error.constraints) {
      result += Object.values(error.constraints).join(', ');
    }
    if (stopAtFirst) {
      break;
    }
  }
  return result;
}