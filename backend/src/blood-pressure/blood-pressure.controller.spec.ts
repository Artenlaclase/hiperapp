import { BloodPressureController } from './blood-pressure.controller';

describe('BloodPressureController', () => {
  let controller: BloodPressureController;
  const serviceMock = {
    create: jest.fn().mockResolvedValue({ id: 1, systolic: 120, diastolic: 80 }),
    findAllByUser: jest.fn().mockResolvedValue([{ id: 1, systolic: 120, diastolic: 80 }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, systolic: 120, diastolic: 80 }),
    update: jest.fn().mockResolvedValue({ id: 1, systolic: 120, diastolic: 80 }),
    remove: jest.fn().mockResolvedValue({ id: 1 })
  };

  beforeEach(() => {
    controller = new BloodPressureController(serviceMock as any);
  });

  it('should create a blood pressure record', async () => {
    expect(await controller.create({ systolic: 120, diastolic: 80, measuredAt: '2026-07-18T12:00:00Z', userId: 1 })).toEqual({ id: 1, systolic: 120, diastolic: 80 });
    expect(serviceMock.create).toHaveBeenCalledWith({ systolic: 120, diastolic: 80, measuredAt: '2026-07-18T12:00:00Z', userId: 1 });
  });

  it('should return all records by user', async () => {
    expect(await controller.findByUser('1')).toEqual([{ id: 1, systolic: 120, diastolic: 80 }]);
    expect(serviceMock.findAllByUser).toHaveBeenCalledWith(1);
  });

  it('should return one record by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, systolic: 120, diastolic: 80 });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a record', async () => {
    expect(await controller.update('1', { systolic: 130 })).toEqual({ id: 1, systolic: 120, diastolic: 80 });
    expect(serviceMock.update).toHaveBeenCalledWith(1, { systolic: 130 });
  });

  it('should remove a record', async () => {
    expect(await controller.remove('1')).toEqual({ id: 1 });
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
