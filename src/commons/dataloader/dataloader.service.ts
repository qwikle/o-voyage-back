import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Any, DataSource } from 'typeorm';

@Injectable()
export class DataloaderService {
  private roleDataLoader: DataLoader<number, any>;
  private userDataLoader: DataLoader<number, any>;
  private travelDataLoader: DataLoader<number, any>;
  private activityDataLoader: DataLoader<number, any>;

  constructor(private readonly dataSource: DataSource) {
    this.roleDataLoader = this.generateDataLoader('Role');
    this.userDataLoader = this.generateDataLoader('User');
    this.travelDataLoader = this.generateDataLoader('Travel');
    this.activityDataLoader = this.generateDataLoader('Activity');
  }

  private generateDataLoader = (entityName: string) => {
    return new DataLoader(async (ids: number[]) => {
      const results = await this.dataSource.manager
        .getRepository(entityName)
        .findBy({ id: Any(ids) });
      return ids.map((id) => results.find((result) => result.id === id));
    });
  };

  public getRoleDataLoader(): DataLoader<number, any> {
    return this.roleDataLoader;
  }

  public getUserDataLoader(): DataLoader<number, any> {
    return this.userDataLoader;
  }

  public getTravelDataLoader(): DataLoader<number, any> {
    return this.travelDataLoader;
  }

  public getActivityDataLoader(): DataLoader<number, any> {
    return this.activityDataLoader;
  }
}
