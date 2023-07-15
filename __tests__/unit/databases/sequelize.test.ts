import { Sequelize } from 'sequelize';
import { checkSequelizeConnection } from '../../../src/databases/sequelize';
import { databaseName, databasePort } from '../../../src/configs';
import { sequelize } from '../../../src/databases';

describe('Sequelize', () => {
  describe('checkSequelizeConnection', () => {
    test('should log successful connection message', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      jest.spyOn(Sequelize.prototype, 'authenticate').mockResolvedValueOnce();

      await checkSequelizeConnection();

      const expectedMessage = `Database '${databaseName}' on port '${databasePort}' is connected successfully!`;
      expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
    });

    test('should not log connection message', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      jest.spyOn(Sequelize.prototype, 'authenticate').mockRejectedValue(new Error());

      await checkSequelizeConnection();

      expect(sequelize.sequelize.authenticate).toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
