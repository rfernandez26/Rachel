import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookstoreModule } from './bookstore/bookstore.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql-1cff46c8-gbox-b821.j.aivencloud.com',
      port: Number(process.env.DB_PORT) || 18170,
      username: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD || 'AVNS_Op1Dnco2PVh9oBmq0xs',
      database: process.env.DB_NAME || 'defaultdb',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    AuthModule,
    BookstoreModule,
  ],
})
export class AppModule {}