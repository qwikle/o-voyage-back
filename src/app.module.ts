import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import configuration from './commons/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // GraphQlModule configuration
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        playground: false,
        status400ForVariableCoercionErrors: true,
        typePaths: ['./**/*.graphql'],
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
          emitTypenameField: true,
          defaultScalarType: 'unknown',
          customScalarTypeMapping: {
            Password: 'string',
          },
        },
        plugins: [ApolloServerPluginLandingPageProductionDefault()],
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().pg.host,
      port: configuration().pg.port,
      username: configuration().pg.username,
      password: configuration().pg.password,
      database: configuration().pg.database,
      autoLoadEntities: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    JwtModule.register({
      global: true,
      secret: configuration().key,
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
