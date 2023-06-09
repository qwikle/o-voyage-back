import { Request, Response } from 'express';
export interface OContext {
  req: ORequest;
  res: Response;
}
export interface JwtPayload {
  id: number;
  ip: string;
  role: number;
}
interface ORequest extends Request {
  auth?: JwtPayload;
}