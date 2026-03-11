// types/next-api-request.d.ts
import "next";

declare module "next" {
  // eslint-disable-next-line no-unused-vars
  interface NextApiRequest {
    context?: {
      user?: any;
      [key: string]: any;
    };
  }
}
