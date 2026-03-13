import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

type CreateCompanyInput = {
  name: string;
  document: string;
};

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  findByDocument(document: string): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: { document },
    });
  }

  create(input: CreateCompanyInput): Promise<Company> {
    return this.prisma.company.create({
      data: {
        name: input.name,
        document: input.document,
      },
    });
  }
}