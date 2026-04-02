import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TenantService } from 'src/tenant/tenant.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tenantService: TenantService,
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(email: string, password: string, shopName: string) {

    // check if user exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create tenant
    const tenant = await this.tenantService.create(shopName);

    // create user
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id,
    });

    return {
      message: 'User registered successfully',
      data: {
        userId: user.id,
        tenantId: tenant.id,
      },
    };
  }

  // LOGIN
  async login(email: string, password: string) {

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      data: {
        access_token: token,
      },
    };
  }
}