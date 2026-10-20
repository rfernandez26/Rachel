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
    UsersModule,
    AuthModule,
    CustomersModule,
    TypeOrmModule,
    BookstoreModule,
    AuthModule,
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