import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';
import { MaterialsModule } from './materials/materials.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductWorkshopsModule } from './product-workshops/product-workshops.module';
import { ProductsModule } from './products/products.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    ProductTypesModule,
    MaterialsModule,
    WorkshopsModule,
    ProductWorkshopsModule,
  ],
})
export class AppModule {}
