import * as DataLoader from 'dataloader';
import { Any } from 'typeorm';
import { IDataLoader } from '../types/dataloader';
import connection from '../database.config';

export class DataloaderService {
  private roleDataLoader: IDataLoader;
  private userDataLoader: IDataLoader;
  private travelDataLoader: IDataLoader;
  private activityDataLoader: IDataLoader;
  private categoryDataLoader: IDataLoader;
  private travelersDataLoader: DataLoader<number, any>;
  private travelsDataLoader: DataLoader<number, any>;

  static dataSource = connection;
  constructor() {
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

    this.travelsDataLoader = this.generateTravelsLoader();
  }

  private generateDataLoader = (
    entityName: string,
    key: any,
    type: 'ONE' | 'MANY' = 'ONE',
  ) => {
    return new DataLoader(async (ids: number[]) => {
      const results = await DataloaderService.dataSource.manager
        .getRepository(entityName)
        .find({ where: { [key]: Any(ids) } });
      return ids.map((id) =>
        type === 'ONE'
          ? results.find((result) => result[key] === id)
          : results.filter((result) => result[key] === id),
      );
    });
  };

  /**
   * @description: get travelers by traveler id
   * @param ids
   * @example: [1,2,3]
   * @returns
   * @memberof DataloaderService
   * @returns {Promise<any[]>}
   * @example: [{travel_id: 1, traveler_id: 1}, {travel_id: 1, traveler_id: 2}]
   * @returns
   * */
  private generateTravelerSLoader = () => {
    return new DataLoader(async (ids: number[]) => {
      const query = `SELECT * FROM get_travelers($1)`;
      const results = await DataloaderService.dataSource.manager.query(query, [
        ids,
      ]);
      const mapped = ids.map((id) =>
        results.filter((result) => result.travel_id === id),
      );
      return mapped.map((item) => this.convertKeysToCamelCase(item));
    });
  };

  /**
   *  @description: get travels by traveler id
   * @param ids
   * @example: [1,2,3]
   * @returns
   * @memberof DataloaderService
   * @returns {Promise<any[]>}
   */
  private generateTravelsLoader = () => {
    return new DataLoader(async (ids: number[]) => {
      const query = `SELECT * FROM get_travels($1)`;
      const results = await DataloaderService.dataSource.manager.query(query, [
        ids,
      ]);
      const mapped = ids.map((id) =>
        results.filter((result) => result.traveler_id === id),
      );
      return mapped.map((item) => this.convertKeysToCamelCase(item));
    });
  };

  /**
   *
   * @param obj
   * @description Convert snake_case to camelCase
   * @example { user_id: 1 } => { userId: 1 }
   * @returns
   */
  private convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToCamelCase(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const convertedObj: any = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const camelCaseKey = key.replace(/_(\w)/g, (_, char) =>
            char.toUpperCase(),
          );
          const value = obj[key];

          if (value instanceof Date) {
            convertedObj[camelCaseKey] = value;
          } else {
            convertedObj[camelCaseKey] = this.convertKeysToCamelCase(value);
          }
        }
      }

      return convertedObj;
    }

    return obj;
  }

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

  public getTravels(): DataLoader<number, any> {
    return this.travelsDataLoader;
  }
}
