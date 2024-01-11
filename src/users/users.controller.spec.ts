import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { Serializer } from 'src/interceptors/serialize.interceptors';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'dladjdl',
        } as UserEntity),
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'asdawdaa' } as UserEntity,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUser return list of users with given email', async () => {
    const users = await controller.findAllUser('asdf@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@test.com');
  });

  it('findUser return a single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('4')).rejects.toThrow(NotFoundException);
  });

  it('sign In updates session object and returns user', async () => {
    const sessoin = { userId: 10 };
    const user = await controller.login(
      { email: 'adsad@test.com', password: 'fdawad' },
      sessoin,
    );
    expect(user.id).toEqual(1);
    expect(sessoin.userId).toEqual(1);
  });
});
