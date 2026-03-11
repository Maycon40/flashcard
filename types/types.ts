// Definições claras e reutilizáveis
export interface User {
  id?: string;
  email?: string;
  username?: string;
  features?: string[];
  password?: string;
}

export interface ActivationToken {
  id: string;
}

export interface Resource {
  id: string;
}
