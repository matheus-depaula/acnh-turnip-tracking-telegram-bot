import log4js from 'log4js';
import { NodeEnvironment } from '../../infrastructure/settings/setting-validation';

export class Logger {
  private logger!: log4js.Logger;

  constructor(className?: string) {
    this.logger = log4js.getLogger(className);
    this.logger.level = (process.env.NODE_ENV as NodeEnvironment) === 'development' ? log4js.levels.ALL : log4js.levels.INFO;
  }

  public trace(message: any, ...args: any[]) {
    this.logger.trace(message, ...args);
  }

  public debug(message: any, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  public info(message: any, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  public warn(message: any, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  public error(message: any, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  public fatal(message: any, ...args: any[]) {
    this.logger.fatal(message, ...args);
  }
}
