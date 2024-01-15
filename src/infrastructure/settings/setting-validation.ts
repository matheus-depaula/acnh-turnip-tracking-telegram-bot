import { Logger } from '../../services/logger';
import { castNumber } from '../../helpers/cast-number';

export type NodeEnvironment = 'production' | 'development';

export class SettingValidation {
  private readonly logger!: Logger;

  constructor() {
    this.logger = new Logger('Settings');
  }

  protected assertAndReturnStringSetting(settingName: string): string {
    const setting = this.returnSetting(settingName);

    if (!setting) throw new Error(this.errorMessage(settingName));

    return setting;
  }

  protected assertAndReturnNumberSetting(settingName: string): number {
    const rawSetting = this.returnSetting(settingName);
    const setting = castNumber(rawSetting);

    if (!setting) throw new Error(this.errorMessage(settingName));

    return setting;
  }

  protected assertAndReturnNodeEnvironmentSetting(settingName: string): NodeEnvironment {
    const setting = this.returnSetting(settingName);

    if (!setting) throw new Error(this.errorMessage(settingName));

    if (setting !== 'production' && setting !== 'development') {
      const message = `${settingName} invalid value. Must be 'development' or 'production'`;

      this.errorMessage('', message);

      throw new Error(message);
    }

    return setting;
  }

  private errorMessage(settingName: string, errorMessage?: string): string {
    const message = errorMessage ?? `You need to configure the ${settingName} environment variable`;

    this.logger.error(message);

    return message;
  }

  private returnSetting(settingName: string): string | undefined {
    const setting = process.env[settingName];

    if (setting === null) return undefined;

    return setting;
  }
}
