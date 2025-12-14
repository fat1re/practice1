import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWorkshop } from './product-workshop.entity';
import { ProductWorkshopsController } from './product-workshops.controller';
import { ProductWorkshopsService } from './product-workshops.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWorkshop])],
  controllers: [ProductWorkshopsController],
  providers: [ProductWorkshopsService],
  exports: [ProductWorkshopsService],
})
export class ProductWorkshopsModule {}
