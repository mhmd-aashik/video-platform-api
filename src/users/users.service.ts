import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq } from 'drizzle-orm';
import { organizations, users } from '../database/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateUserDto) {
    // 1. Make sure the organization exists.
    const [organization] = await this.databaseService.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, dto.organizationId))
      .limit(1);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // 2. Check whether this email is already registered.
    const [existingUser] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 3. Never store the plain password.
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 4. Create the user.
    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        organizationId: dto.organizationId,
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: 'USER',
      })
      .returning({
        id: users.id,
        organizationId: users.organizationId,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return user;
  }
}
