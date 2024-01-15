import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Settings } from '../infrastructure/settings';
import { Logger } from '../services/logger';
import { Scheduler } from '../services/scheduler';

export class Bot {
  private logger!: Logger;
  private bot!: TelegramBot;
  private settings!: Settings;
  private scheduler!: Scheduler;

  constructor() {
    this.settings = new Settings();
    this.scheduler = new Scheduler();
    this.logger = new Logger(this.constructor.name);
    this.bot = new TelegramBot(this.settings.getTelegramToken(), { polling: true });
  }

  public init() {
    this.logger.info('✨Online listening');

    this.bot.on('err', this.logger.error);
    this.bot.on('polling_error', this.logger.error);

    this.bot.onText(/\/start/, this.onStart);
    this.bot.onText(/\/cancel/, this.onCancel);
  }

  private onStart = (message: Message) => {
    const cronRule = this.settings.getMessageCronJobRule();

    this.scheduler.addJob(message.chat.id, cronRule, () => this.bot.sendMessage(message.chat.id, 'Hello World!'));
  };

  private onCancel = (message: Message) => this.scheduler.removeJob(message.chat.id);
}
