import { Request, Response } from 'express';
import { DataLoaderInterface } from './dataloader';
export interface OContext {
  req: ORequest;
  res: Response;
  dataloader: DataLoaderInterface;
}
export interface JwtPayload {
  id: number;
  ip: string;
  role: number;
}
interface ORequest extends Request {
  auth?: JwtPayload;
}
