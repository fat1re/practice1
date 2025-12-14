import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
