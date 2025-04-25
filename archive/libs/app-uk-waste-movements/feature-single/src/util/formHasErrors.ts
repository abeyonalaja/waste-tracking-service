import { FormErrors } from '../types/types';

export function formHasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some((error) => error.valid === false);
}
