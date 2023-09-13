import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersServices: Partial<UsersService>;
  beforeEach(async () => {
    //create a fake copy of user service
    const users: User[] = [];
    fakeUsersServices = {
      find: (email: string) => {
        const filterUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filterUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersServices,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Create a new user with password is hashed', async () => {
    const user = await service.signup('test@gmail.com', 'test123');
    expect(user.password).not.toEqual('test123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@gmail.com', 'test123');
    await expect(service.signup('test@gmail.com', 'test123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(service.signin('asdf@gmail.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throw if an invalid password is provided', async () => {
    await service.signup('test@gmail.com', 'test123');
    await expect(service.signin('test@gmail.com', 'asdfa')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('return a user if correct password is provided', async () => {
    await service.signup('test@gmail.com', 'test123');
    const user = await service.signin('test@gmail.com', 'test123');
    expect(user).toBeDefined();
  });
});
