
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookstoreModule } from './bookstore/bookstore.module';
import { AuthorsModule } from './authors/authors.module';
import { CustomersModule } from './customers/customers.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './Employees/employees.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order_items/order-item.module';
import { PaymentsModule } from './payments/payments.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    DatabaseModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 3,
      retryDelay: 3000,
    }),

    UsersModule,
    AuthModule,
    BookstoreModule,
    AuthorsModule,
    CustomersModule,
    EmployeesModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    SuppliersModule,
  ],
})
export class AppModule {}
