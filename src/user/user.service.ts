import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    //find existing user by email
    async findByEmail(email: string) {

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        return user;
    }

    //create new user
    async create(data: {
        email: string;
        password: string;
        role: string;
        tenantId: string;
        }) {
        const user = await this.prisma.user.create({
            data: { ...data },
        });
        return user;
    }

}
