import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';

export const AppValidationPipe = new ValidationPipe({
  whitelist: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = errors.map((error) => {
      const field = error.property;
      const constraints = error.constraints;
      const messages = constraints
        ? Object.keys(constraints).map((key) => {
            switch (key) {
              case 'isString':
                return `El campo "${field}" debe ser una cadena de texto.`;
              case 'isNotEmpty':
                return `El campo "${field}" no debe estar vacío.`;
              case 'isBoolean':
                return `El campo "${field}" debe ser booleano (true/false).`;
              case 'isObject':
                return `El campo "${field}" debe ser un objeto válido.`;
              case 'isNumber':
                return `El campo "${field}" debe ser un número.`;
              case 'isInt':
                return `El campo "${field}" debe ser un número entero.`;
              case 'isEmail':
                return `El campo "${field}" debe ser un correo electrónico válido.`;
              case 'isDate':
                return `El campo "${field}" debe ser una fecha válida.`;
              case 'isArray':
                return `El campo "${field}" debe ser un arreglo.`;
              case 'isEnum':
                return `El campo "${field}" debe ser uno de los valores permitidos.`;
              case 'length':
                return `El campo "${field}" debe tener una longitud de ${constraints?.length} caracteres.`;
              case 'minLength':
                return `El campo "${field}" debe tener al menos ${constraints?.minLength} caracteres.`;
              case 'maxLength':
                return `El campo "${field}" debe tener como máximo ${constraints?.maxLength} caracteres.`;
              case 'min':
                return `El valor del campo "${field}" debe ser mayor o igual a ${constraints?.min}.`;
              case 'max':
                return `El valor del campo "${field}" debe ser menor o igual a ${constraints?.max}.`;
              case 'matches':
                return `El campo "${field}" no cumple con el formato requerido.`;
              case 'isUUID':
                return `El campo "${field}" debe ser un UUID válido.`;
              case 'isOptional':
                return `El campo "${field}" es opcional.`;
              case 'isIn':
                return `The field "${field}" must be an allowed value.`;
              default:
                return `El campo "${field}" tiene un error de validación.`;
            }
          })
        : [];

      return {
        field,
        messages,
      };
    });

    return new BadRequestException({
      statusCode: 400,
      message:
        'Error de validación: ' +
        formattedErrors.map((error) => error.messages).flat()[0],
    });
  },
});
