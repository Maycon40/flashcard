import Joi from "joi";

import { ValidationError } from "@/infra/errors";

const validate = {
  email: (value: string, required: string) => {
    if (required == "required" && !value) {
      throw new ValidationError({
        message: `O campo "email" é obrigatório.`,
        action: `Preencha o campo "email".`,
      });
    }

    const { error, value: sanitizedValue } = Joi.string()
      .email()
      .validate(value);

    if (error) {
      throw new ValidationError({
        message: 'O campo "email" foi preenchido de maneira inválida.',
        action: "Ajuste os dados enviados e tente novamente.",
      });
    }

    return sanitizedValue;
  },

  password: (value: string, required: string) => {
    if (required == "required" && !value) {
      throw new ValidationError({
        message: `O campo "senha" é obrigatório.`,
        action: `Preencha o campo "senha".`,
      });
    }
  },

  username: (value: string, required: string) => {
    if (required == "required" && !value) {
      throw new ValidationError({
        message: `O campo "username" é obrigatório.`,
        action: `Preencha o campo "username".`,
      });
    }
  },
};

function verify(object: Record<string, any>, fields: Record<string, string>) {
  try {
    object = JSON.parse(JSON.stringify(object));
  } catch (error) {
    throw new ValidationError({
      message: "Não foi possível interpretar o valor enviado.",
      action: "Verifique se o valor enviado é um JSON válido.",
      cause: error as Error,
    });
  }

  for (const [name, required] of Object.entries(fields)) {
    const fieldName = name as keyof typeof validate;
    const inputValue = object[fieldName];

    validate[fieldName](inputValue, required);
  }

  return object;
}

const validator = {
  verify,
};

export default validator;
