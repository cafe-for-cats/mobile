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

  it('should add a protest', async () => {
    const _id = '6088b864a6c9b94094b43e42';

    const user = new User({
      _id,
      username: 'test-automation',
      associatedProtests: [],
    });

    const protest = new Protest({
      _id: '60b974f68a66171753b8bde9',
    });

    findByUserIdMock = sinon
      .stub(userStatics, 'findUserById')
      .callsFake(async () => await user);

    addProtestMock = sinon
      .stub(protestStatics, 'addProtest')
      .callsFake(async () => await protest);

    const obj = {
      userId: _id,
      title: 'title',
      description: 'description',
      startDate: new Date(),
      duration: 200,
    };

    const response = await protestsService.addProtest(obj);

    const result = {
      status: true,
      message: 'Added protest.',
      payload: { newItem: { _id: new ObjectId('60b974f68a66171753b8bde9') } },
    };

    expect(response).to.deep.equal(result);
  });
});
