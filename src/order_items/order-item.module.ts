import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrderItemsService } from './order-item.service';
import { OrderItemsController } from './order-item.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}