import { DataSource } from 'typeorm';
import configuration from './configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy';
const connection = new DataSource({
  type: 'postgres',
  host: configuration().pg.host,
  port: configuration().pg.port,
  username: configuration().pg.username,
  password: configuration().pg.password,
  database: configuration().pg.database,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
});

connection.initialize();

export default connection;
