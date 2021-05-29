import { assert, expect } from 'chai';
import { constants } from 'http2';
import { Document } from 'mongoose';
import sinon, { SinonSandbox, SinonStubbedInstance } from 'sinon';
import { spy, stub } from 'sinon';
import { UsersService } from './users.service';
import * as statics from './users.statics';

describe('UsersService', function () {
  let usersService: UsersService;
  let staticsMock: SinonStubbedInstance<typeof statics.findUserById>;

  beforeEach(() => {
    staticsMock = sinon.stub(statics, 'findUserById');
    usersService = new UsersService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create', () => {
    expect(usersService).to.be.ok;
  });

  it('should return false and throw error if no user is found', async () => {
    const userId = 'invalid id';
    const u = await usersService.getUserById(userId);

    expect({ status: false, message: 'User not found.' });
  });

  it('should return true if a user is found', async () => {
    const doc = new Document();
    staticsMock = sinon
      .stub(statics, 'findUserById')
      .callsFake(async () => await doc);
  });
});
