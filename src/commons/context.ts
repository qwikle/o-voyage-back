import { Request, Response } from 'express';
export interface OContext {
  req: Request;
  res: Response;
}
