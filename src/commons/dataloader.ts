import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Any, DataSource } from 'typeorm';

@Injectable()
export class LoaderService implements LoaderInterface {
  constructor(private readonly datasource: DataSource) {}

  createDataLoader<T>(entity: any, property: string) {
    const dataLoaderFn = async (keys: readonly any[]) => {
      const results = await this.datasource
        .getRepository(entity)
        .findBy({ [property]: Any(keys) });
      return keys.map((key) =>
        results.find((result: T) => result[property] === key),
      );
    };
    return new DataLoader(dataLoaderFn);
  }
}
export interface LoaderInterface {
  createDataLoader<T>(entity: T, property: string): DataLoader<any, any, any>;
}
