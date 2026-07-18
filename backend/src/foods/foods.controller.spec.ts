import { FoodsController } from './foods.controller';

describe('FoodsController', () => {
  let controller: FoodsController;
  const serviceMock = {
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Apple' }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Apple' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Apple' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Apple', category: 'Fruit' }),
    remove: jest.fn().mockResolvedValue({ id: 1 })
  };

  beforeEach(() => {
    controller = new FoodsController(serviceMock as any);
  });

  it('should create a food item', async () => {
    expect(await controller.create({ name: 'Apple' })).toEqual({ id: 1, name: 'Apple' });
    expect(serviceMock.create).toHaveBeenCalledWith({ name: 'Apple' });
  });

  it('should return all food items', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, name: 'Apple' }]);
  });

  it('should return a food item by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: 1, name: 'Apple' });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a food item', async () => {
    expect(await controller.update('1', { category: 'Fruit' })).toEqual({ id: 1, name: 'Apple', category: 'Fruit' });
    expect(serviceMock.update).toHaveBeenCalledWith(1, { category: 'Fruit' });
  });

  it('should remove a food item', async () => {
    expect(await controller.remove('1')).toEqual({ id: 1 });
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});
