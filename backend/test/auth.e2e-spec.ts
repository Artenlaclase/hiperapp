import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const usersServiceMock = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    setRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    findById: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user successfully', async () => {
    const payload = { name: 'Juan Pérez', email: 'juan@mail.com', password: '12345678' };
    usersServiceMock.findByEmail.mockResolvedValue(null);
    usersServiceMock.createUser.mockResolvedValue({ id: 1, name: payload.name, email: payload.email });

    const response = await request(app.getHttpServer()).post('/api/auth/register').send(payload).expect(201);

    expect(response.body).toEqual({ id: 1, name: payload.name, email: payload.email });
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(payload.email);
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(expect.objectContaining({ email: payload.email }));
  });

  it('logs in successfully and returns tokens', async () => {
    const rawPassword = '12345678';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const user = { id: 1, name: 'Juan Pérez', email: 'juan@mail.com', password: hashedPassword };

    usersServiceMock.findByEmail.mockResolvedValue(user);
    usersServiceMock.setRefreshToken.mockResolvedValue({});

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: user.email, password: rawPassword })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(usersServiceMock.setRefreshToken).toHaveBeenCalledWith(user.id, expect.any(String));
  });

  it('returns an error when login credentials are invalid', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'no@user.com', password: 'wrong' })
      .expect(201);

    expect(response.body).toEqual({ error: 'Invalid credentials' });
  });

  it('refreshes tokens when refresh token is valid', async () => {
    const refreshToken = 'valid-refresh-token';
    const user = { id: 1, email: 'juan@mail.com' };
    usersServiceMock.validateRefreshToken.mockResolvedValue(true);
    usersServiceMock.findById.mockResolvedValue({ id: 1, email: 'juan@mail.com' });
    usersServiceMock.setRefreshToken.mockResolvedValue({});

    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ userId: user.id, refreshToken })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(usersServiceMock.validateRefreshToken).toHaveBeenCalledWith(user.id, refreshToken);
  });
});
