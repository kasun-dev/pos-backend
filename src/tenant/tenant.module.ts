import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Prisma } from 'generated/prisma/browser';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
