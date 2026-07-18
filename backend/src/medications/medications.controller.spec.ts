import { MedicationsController } from './medications.controller';

describe('MedicationsController', () => {
  let controller: MedicationsController;
  const serviceMock = {
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Losartán', dosage: '50mg' }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Losartán', dosage: '50mg' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Losartán', dosage: '50mg' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Losartán', dosage: '50mg' }),
    remove: jest.fn().mockResolvedValue({ id: 1 })
  };

  beforeEach(() => {
    controller = new MedicationsController(serviceMock as any);
  });

  it('should create a medication', async () => {
    expect(await controller.create({ name: 'Losartán', dosage: '50mg', instructions: '1 vez al día' })).toEqual({ id: 1, name: 'Losartán', dosage: '50mg' });
    expect(serviceMock.create).toHaveBeenCalledWith({ name: 'Losartán', dosage: '50mg', instructions: '1 vez al día' });
  });

  it('should return all medications', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, name: 'Losartán', dosage: '50mg' }]);
  });

  it('should return a medication by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, name: 'Losartán', dosage: '50mg' });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a medication', async () => {
    expect(await controller.update('1', { dosage: '100mg' })).toEqual({ id: 1, name: 'Losartán', dosage: '50mg' });
    expect(serviceMock.update).toHaveBeenCalledWith(1, { dosage: '100mg' });
  });

  it('should remove a medication', async () => {
    expect(await controller.remove('1')).toEqual({ id: 1 });
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
