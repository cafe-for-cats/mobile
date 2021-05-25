import { assert, expect } from 'chai';
import { spy, stub } from 'sinon';
import { UsersService } from './users.service';
import * as statics from './users.statics';

describe('UsersService', function () {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
  });

  it('should create', () => {
    const foo = { title: 'hello', description: 'hello' };
    stub(statics, 'findUserById').returns(Promise.resolve(null));
    expect(usersService);
  });

  it('should find by user id', () => {
    const userId = '123';
    usersService.getUserById(userId);
  });
});
