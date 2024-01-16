import TelegramBot, { Message, BotCommand } from 'node-telegram-bot-api';
import { Settings } from '../infrastructure/settings';
import { Logger } from '../services/logger';
import { Scheduler } from '../services/scheduler';
import { TurnipCalculatorApi } from '../services/turnip-calculator-api';
import { Jimp, WriteOnImageProps } from '../services/jimp';

export class Bot {
  private commands!: BotCommand[];
  private logger!: Logger;
  private bot!: TelegramBot;
  private settings!: Settings;
  private scheduler!: Scheduler;
  private api!: TurnipCalculatorApi;

  constructor() {
    this.settings = new Settings();
    this.scheduler = new Scheduler();
    this.api = new TurnipCalculatorApi();
    this.logger = new Logger(this.constructor.name);
    this.bot = new TelegramBot(this.settings.getTelegramToken(), { polling: true });

    this.commands = [
      { command: '/subscribe', description: 'Subscribes to the daily reminder' },
      { command: '/cancel', description: 'Unsubscribes from the daily reminder' },
      { command: '/ping', description: 'Checks if everything is ok' },
    ];
  }

  public init() {
    this.logger.info('✨Isabelle is online and listening');

    this.bot.setMyCommands(this.commands);

    this.bot.on('err', this.logger.error);
    this.bot.on('polling_error', this.logger.error);

    this.bot.onText(/\/subscribe/, this.onSubscribe);
    this.bot.onText(/\/unsubscribe/, this.onUnsubscribe);
    this.bot.onText(/\/ping/, this.onPing);
    this.bot.onText(/\/test/, this.onTest);
  }

  private onSubscribe = (message: Message) => {
    const cronRule = this.settings.getMessageCronJobRule();

    this.scheduler.addJob(message.chat.id, cronRule, () => this.dailyReminder(message.chat.id));

    this.bot.sendMessage(message.chat.id, 'Successfully subcribed!');
  };

  private onUnsubscribe = (message: Message) => this.scheduler.removeJob(message.chat.id);

  private onPing = (message: Message) => this.bot.sendMessage(message.chat.id, 'Pong');

  private onTest = (message: Message) => {
    const params: WriteOnImageProps = {
      text: `Hello, ${message.from?.first_name}`,
      filename: 'isabelle.png',
      coordinates: { x: 400, y: 710 },
    };

    Jimp.writeOnImage(params).then(data => this.bot.sendPhoto(message.chat.id, data));
  };

  private dailyReminder(chatId: number) {
    this.bot.sendMessage(chatId, 'Daily reminder!');
  }

  private handleError(chatId: number, err?: Error) {
    if (err) this.logger.error(err);

    this.bot.sendMessage(chatId, 'Something went wrong o.O`');
  }
}
