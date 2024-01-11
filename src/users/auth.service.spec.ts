import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    const users: UserEntity[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as UserEntity;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@testpsd.com', 'adsdas');
    const [salt, hash] = user.password.split(',');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user sings up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
    //   it('throws an error if user signs up with email that is in use', async () => {
    //     try {
    //         await service();
    //         expect(...);
    //     } catch (err) {
    //     }
    // });
    // or use the done format

    // it('throws an error if user signs up with email that is in use', (done) => {
    //     ...
    //     service()
    //      .then( ...) {}
    //      .catch( ...) {}
    //     }
    //     done();
  });

  it('throws if sign in is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });
  it('throws if an unvalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf1');
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if correct password provideed', async () => {
    await service.signup('asdf@asdf.com', 'asdf');

    const user = await service.signin('asdf@asdf.com', 'asdf');
    expect(user).toBeDefined();
  });
});
