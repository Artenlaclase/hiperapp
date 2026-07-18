import { FoodLogsController } from './food-logs.controller';

describe('FoodLogsController', () => {
  let controller: FoodLogsController;
  const serviceMock = {
    create: jest.fn().mockResolvedValue({ id: 1, foodId: 1, portion: '1 cup' }),
    findAllByUser: jest.fn().mockResolvedValue([{ id: 1, foodId: 1, portion: '1 cup' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, foodId: 1, portion: '1 cup' }),
    update: jest.fn().mockResolvedValue({ id: 1, foodId: 1, portion: '1 cup' }),
    remove: jest.fn().mockResolvedValue({ id: 1 })
  };

  beforeEach(() => {
    controller = new FoodLogsController(serviceMock as any);
  });

  it('should create a food log record', async () => {
    expect(await controller.create({ foodId: 1, portion: '1 cup', consumedAt: '2026-07-18T13:00:00Z', userId: 1 })).toEqual({ id: 1, foodId: 1, portion: '1 cup' });
    expect(serviceMock.create).toHaveBeenCalledWith({ foodId: 1, portion: '1 cup', consumedAt: '2026-07-18T13:00:00Z', userId: 1 });
  });

  it('should return all food logs by user', async () => {
    expect(await controller.findByUser('1')).toEqual([{ id: 1, foodId: 1, portion: '1 cup' }]);
    expect(serviceMock.findAllByUser).toHaveBeenCalledWith(1);
  });

  it('should return one food log record by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, foodId: 1, portion: '1 cup' });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a food log record', async () => {
    expect(await controller.update('1', { portion: '2 cups' })).toEqual({ id: 1, foodId: 1, portion: '1 cup' });
    expect(serviceMock.update).toHaveBeenCalledWith(1, { portion: '2 cups' });
  });

  it('should remove a food log record', async () => {
    expect(await controller.remove('1')).toEqual({ id: 1 });
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
