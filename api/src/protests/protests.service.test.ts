import { expect } from 'chai';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ProtestsService } from './protests.service';
import * as protestStatics from './protests.statics';
import * as userStatics from '../users/users.statics';
import { UsersService } from '../users/users.service';
import User from '../users/users.models';
import Protest from './protests.models';
import { ObjectId } from 'mongodb';

describe('ProtestsService', function () {
  let protestsService: ProtestsService;
  let usersService: UsersService;
  let findByUserIdMock: SinonStubbedInstance<typeof userStatics.findUserById>;
  let addProtestMock: SinonStubbedInstance<typeof protestStatics.addProtest>;

  beforeEach(() => {
    protestsService = new ProtestsService();
    usersService = new UsersService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create', () => {
    expect(usersService).to.be.ok;
  });

  it('should add a protest', async () => {});
});
