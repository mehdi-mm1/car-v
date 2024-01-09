import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  create(email: string, password: string) {
    const usr = this.repo.create({ email, password });
    return this.repo.save(usr);
  }

  findOne(id: number): Promise<UserEntity | null> {
    if (!id) {
      throw new NotFoundException('user not found!');
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: number, attr: Partial<UserEntity>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('user not found!');
    }
    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const usr = await this.findOne(id);
    if (!usr) {
      throw new Error('user not found');
    }
    return this.repo.remove(usr);
  }
}
