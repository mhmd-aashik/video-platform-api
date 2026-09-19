import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { organizations } from '../database/schemas';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateOrganizationDto) {
    const [organization] = await this.databaseService.db
      .insert(organizations)
      .values({
        name: dto.name,
      })
      .returning();

    return organization;
  }
}
