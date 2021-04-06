import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let httpClientSpy: { post: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new JwtService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set token after logging in successfully', () => {
    const spy = spyOn(localStorage, 'setItem');

    httpClientSpy.post.and.returnValue(of(res));

    service
      .login('username', 'password')
      .subscribe((res) => expect(res).toEqual(res));

    expect(spy).toHaveBeenCalledWith('token', res.token);
  });

  it('should remove the token on logging out', () => {
    const spy = spyOn(localStorage, 'removeItem');

    service.logout();

    expect(spy).toHaveBeenCalledWith('token');
  });

  it('should get logged in status', () => {
    spyOn(localStorage, 'getItem').and.returnValue(res.token);

    expect(service.loggedIn).toBeTrue();
  });
});

const res = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};
