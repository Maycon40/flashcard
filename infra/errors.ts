export interface InternalServerErrorOptions {
  cause?: Error | string;
  action?: string;
  statusCode?: number;
}

export interface ErrorJSON {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export interface GenericErrorOptions {
  cause?: Error | string;
  message?: string;
  action?: string;
  key?: string;
}

export class InternalServerError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, action, statusCode }: InternalServerErrorOptions = {}) {
    // `Error`'s constructor in some TS libs accepts an options object with `cause`.
    // Use `as any` to be compatible across TS versions.
    super("Um erro interno não inesperado aconteceu.", { cause } as any);
    this.name = "InternalServerError";
    this.action = action || "Entre em contato com o suporte";
    this.statusCode = statusCode ?? 500;
  }
  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: GenericErrorOptions = {}) {
    super(message || "Serviço indisponível no momento.", { cause } as any);
    this.name = "ServiceError";
    this.action = action || "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: GenericErrorOptions = {}) {
    super(message || "Um erro de validação ocorreu.", { cause } as any);
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  public action: string;
  public statusCode: number;
  key: string | undefined;

  constructor({ cause, message, action, key }: GenericErrorOptions = {}) {
    super(message || "Recurso não foi encontrado.", { cause } as Error);
    this.name = "NotFoundError";
    this.action =
      action || "Verifique se as informções enviadas estão corretas.";
    this.statusCode = 404;
    this.key = key;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: GenericErrorOptions = {}) {
    super(message || "Usuário não autenticado.", { cause } as any);
    this.name = "UnauthorizedError";
    this.action = action || "Faça novamente o login para continuar.";
    this.statusCode = 401;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ForbiddenError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: GenericErrorOptions = {}) {
    super(message || "Acesso Negado.", { cause } as any);
    this.name = "ForbiddenError";
    this.action =
      action || "Verifique as permissões necessárias antes de continuar.";
    this.statusCode = 403;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public action: string;
  public statusCode: number;

  constructor() {
    super("Método não permitido para esse endpoint.");
    this.name = "MethoNotAllowedError";
    this.action =
      "Verifique se o método HTTP enviado é valido para esse endpoint.";
    this.statusCode = 405;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
