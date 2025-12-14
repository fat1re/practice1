import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Material } from 'src/materials/material.entity';
import { ProductType } from 'src/product-types/product-type.entity';
import { ProductWorkshop } from 'src/product-workshops/product-workshop.entity';
import { Product } from 'src/products/product.entity';
import { Workshop } from 'src/workshops/workshop.entity';

const env = typeof process !== 'undefined' ? (process.env ?? {}) : {};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.DATABASE_HOST || 'localhost',
  port: parseInt(env.DATABASE_PORT || '5432', 10),
  username: env.DATABASE_USERNAME || 'postgres',
  password: env.DATABASE_PASSWORD || 'postgres',
  database: env.DATABASE_NAME || 'mebel',
  entities: [Product, ProductType, Material, Workshop, ProductWorkshop],
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  dropSchema: false,
};
