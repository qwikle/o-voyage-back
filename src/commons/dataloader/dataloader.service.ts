import { Inject, Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Any, DataSource } from 'typeorm';
import { CONTEXT } from '@nestjs/graphql';
import { IDataLoader } from '../types/dataloader';

@Injectable()
export class DataloaderService {
  private roleDataLoader: IDataLoader;
  private userDataLoader: IDataLoader;
  private travelDataLoader: IDataLoader;
  private activityDataLoader: IDataLoader;
  private categoryDataLoader: IDataLoader;
  private travelersDataLoader: DataLoader<number, any>;

  constructor(
    private readonly dataSource: DataSource,
    @Inject(CONTEXT) private readonly context: any,
  ) {
    this.roleDataLoader = {
      one: this.generateDataLoader('Role', 'id'),
      many: this.generateDataLoader('Role', 'id', 'MANY'),
    };
    this.userDataLoader = {
      one: this.generateDataLoader('User', 'id'),
      many: this.generateDataLoader('User', 'id', 'MANY'),
    };
    this.travelDataLoader = {
      one: this.generateDataLoader('Travel', 'id'),
      many: this.generateDataLoader('Travel', 'id', 'MANY'),
    };
    this.activityDataLoader = {
      one: this.generateDataLoader('Activity', 'id'),
      many: this.generateDataLoader('Activity', 'id', 'MANY'),
      by: {
        manyTravelId: this.generateDataLoader('Activity', 'travelId', 'MANY'),
      },
    };
    this.categoryDataLoader = {
      one: this.generateDataLoader('Category', 'id'),
      many: this.generateDataLoader('Category', 'id', 'MANY'),
    };
    this.travelersDataLoader = this.generateTravelerSLoader();

    this.context.dataloader = this;
  }

  private generateDataLoader = (
    entityName: string,
    key: any,
    type: 'ONE' | 'MANY' = 'ONE',
  ) => {
    return new DataLoader(async (ids: number[]) => {
      const results = await this.dataSource.manager
        .getRepository(entityName)
        .find({ where: { [key]: Any(ids) } });
      return ids.map((id) =>
        type === 'ONE'
          ? results.find((result) => result[key] === id)
          : results.filter((result) => result[key] === id),
      );
    });
  };

  private generateTravelerSLoader = () => {
    return new DataLoader(async (ids: number[]) => {
      const query = `SELECT * FROM get_travelers($1)`;
      const results = await this.dataSource.manager.query(query, [ids]);
      return ids.map((id) =>
        results.filter((result) => result.travel_id === id),
      );
    });
  };

  public getByRole(): IDataLoader {
    return this.roleDataLoader;
  }

  public getByUser(): IDataLoader {
    return this.userDataLoader;
  }

  public getByTravel(): IDataLoader {
    return this.travelDataLoader;
  }

  public getByActivity(): IDataLoader {
    return this.activityDataLoader;
  }

  public getTravelers(): DataLoader<number, any> {
    return this.travelersDataLoader;
  }

  public getByCategory(): IDataLoader {
    return this.categoryDataLoader;
  }
}
