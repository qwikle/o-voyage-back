import * as DataLoader from 'dataloader';

export interface IDataLoader {
  one: DataLoader<number, any>;
  many: DataLoader<number, any>;
  by?: Record<string, DataLoader<number, any>>;
}

export interface DataLoaderInterface {
  getByRole(): IDataLoader;
  getByUser(): IDataLoader;
  getByTravel(): IDataLoader;
  getByActivity(): IDataLoader;
  getByCategory(): IDataLoader;
  getTravelers(): DataLoader<number, any>;
}
