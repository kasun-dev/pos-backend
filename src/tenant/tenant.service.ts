import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
    constructor(private prisma: PrismaService) {}

    //create a tentant 
    async create(shopName: string) {
        const tentant = await this.prisma.tenant.create({
            data: {
                name: shopName,
            },
        });
        return tentant;
    }
}
