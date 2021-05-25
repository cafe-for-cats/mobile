import { assert, expect, spy } from 'chai';
import { stub } from 'sinon';
import { UsersService } from './users.service';
import * as statics from './users.statics';

describe('UsersService', function () {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
    stub(statics, 'findUserById');
    stub(statics, 'findUserByUsername');
    stub(statics, 'addUser');
    stub(statics, 'updateUsersAssociatedProtests');
  });

  it('should create', () => {
    expect(usersService);
  });
});
