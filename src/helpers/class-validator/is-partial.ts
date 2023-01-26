import { ValidateIf, ValidationOptions } from 'class-validator';

// Allow undefined
export function IsPartial(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== undefined, validationOptions);
}
