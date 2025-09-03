export const ValidationMessages = {
  isNotEmpty: 'O campo $property não pode estar vazio.',
  isString: 'O campo $property deve ser uma string.',
  isNumber: 'O campo $property deve ser um número.',
  isArray: 'O campo $property deve ser um array.',
  isDecimal: 'O campo $property deve ser um decimal.',
  isInt: 'O campo $property deve ser um número inteiro.',
  isValid: 'O campo $property deve ser válido.',
  isBoolean: 'O campo $property deve ser verdadeiro ou falso.',
  isDate: 'O campo $property deve ser uma data válida.',
  minLength: 'O campo $property deve ter pelo menos $constraint1 caracteres.',
  maxLength: 'O campo $property deve ter no máximo $constraint1 caracteres.',
  min: 'O campo $property deve ser maior ou igual a $constraint1.',
  max: 'O campo $property deve ser menor ou igual a $constraint1.',
  isEmail: 'Deve ser um email válido',
  isEnum: (property: string, values: any[]) =>
    `${property} deve ser um dos seguintes valores: ${values.join(', ')}`,
  isArrayEnum: (property: string, values: any[]) =>
    `${property} deve conter apenas os seguintes valores: ${values.join(', ')}`,
};
