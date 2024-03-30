import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
describe('AppController', () => {
  let appController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile();

    appController = app.get<HealthController>(HealthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.health()).toEqual({ health: true });
    });
  });
});
