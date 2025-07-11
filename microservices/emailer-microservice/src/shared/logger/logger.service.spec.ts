import { Logger } from './logger.interface';
import { AppLogger } from './logger.service';

describe('AppLogger', () => {
   const mockBase: Logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      response: jest.fn(),
   };

   const logger = new AppLogger(mockBase as unknown);

   it('should delegate info', () => {
      logger.info('info');
      expect(mockBase.info).toHaveBeenCalledWith('info');
   });

   it('should delegate warn', () => {
      logger.warn('warn');
      expect(mockBase.warn).toHaveBeenCalledWith('warn');
   });

   it('should delegate error', () => {
      logger.error('err');
      expect(mockBase.error).toHaveBeenCalledWith('err');
   });

   it('should delegate debug', () => {
      logger.debug('dbg', 'source', { a: 1 });
      expect(mockBase.debug).toHaveBeenCalledWith('dbg', 'source', { a: 1 });
   });

   it('should delegate response', () => {
      logger.response('resp', 'SRC', { ok: true });
      expect(mockBase.response).toHaveBeenCalledWith('resp', 'SRC', { ok: true });
   });
});
