import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Any, DataSource } from 'typeorm';

@Injectable()
export class DataloaderService {
  private roleDataLoader: DataLoader<number, any>;
  private userDataLoader: DataLoader<number, any>;
  private travelDataLoader: DataLoader<number, any>;
  private activityDataLoader: DataLoader<number, any>;
  private attendeesDataLoader: DataLoader<number, any>;

  constructor(private readonly dataSource: DataSource) {
    this.roleDataLoader = this.generateDataLoader('Role', 'id');
    this.userDataLoader = this.generateDataLoader('User', 'id');
    this.travelDataLoader = this.generateDataLoader('Travel', 'id');
    this.activityDataLoader = this.generateDataLoader('Activity', 'id');
    this.attendeesDataLoader = this.generateAttendeesLoader();
  }

  private generateDataLoader = (entityName: string, key: any) => {
    return new DataLoader(async (ids: number[]) => {
      const results = await this.dataSource.manager
        .getRepository(entityName)
        .find({ where: { [key]: Any(ids) } });
      return ids.map((id) => results.find((result) => result[key] === id));
    });
  };

  private generateAttendeesLoader = () => {
    return new DataLoader(async (ids: number[]) => {
      const query = `SELECT * FROM get_travelers($1)`;
      const results = await this.dataSource.manager.query(query, [ids]);
      return ids.map((id) =>
        results.filter((result) => result.travel_id === id),
      );
    });
  };

  public getByRole(): DataLoader<number, any> {
    return this.roleDataLoader;
  }

  public getByUser(): DataLoader<number, any> {
    return this.userDataLoader;
  }

  public getByTravel(): DataLoader<number, any> {
    return this.travelDataLoader;
  }

  public getByActivity(): DataLoader<number, any> {
    return this.activityDataLoader;
  }

  public getAttendees(): DataLoader<number, any> {
    return this.attendeesDataLoader;
  }
}
