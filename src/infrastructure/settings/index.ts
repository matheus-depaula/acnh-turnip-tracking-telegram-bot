import 'dotenv/config';
import { NodeEnvironment, SettingValidation } from './setting-validation';

export class Settings extends SettingValidation {
  public getNodeEnv(): NodeEnvironment {
    return this.assertAndReturnNodeEnvironmentSetting('NODE_ENV');
  }

  public getTelegramToken(): string {
    return this.assertAndReturnStringSetting('TELEGRAM_TOKEN');
  }

  public getMessageCronJobRule(): string {
    return this.assertAndReturnStringSetting('MESSAGE_CRON_JOB_RULE');
  }
}
