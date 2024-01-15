import { Settings } from '../../infrastructure/settings';
import { Callback } from '../../utils/callback';
import { Logger } from '../logger';

enum Days {
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
}

interface DailyPrice {
  AM?: number;
  PM?: number;
}

interface Response {
  filter: number[];
  minMaxPattern: number[][];
  avgPattern: number[];
  minWeekValue: number;
  preview: string;
}

export class TurnipCalculatorApi {
  private baseUrl!: string;
  private settings!: Settings;
  private logger!: Logger;

  constructor() {
    this.settings = new Settings();
    this.logger = new Logger(this.constructor.name);
    this.baseUrl = this.settings.getTurnipCalculatorApiBaseUrl();
  }

  public getPricePattern(buyPrice: number, dailyPrices: { [key in Days]?: DailyPrice }, cb: Callback<Response>) {
    const params = Object.keys(Days).reduce((query, day) => {
      const prices: DailyPrice = dailyPrices[day as Days] || { AM: 0, PM: 0 };

      query = `${query}-${prices.AM || 0}-${prices.PM || 0}`;

      return query;
    }, `f=${buyPrice}`);

    const url = `${this.baseUrl}/?${params}`;

    fetch(url)
      .then(res => res.json())
      .then(data => cb(null, data as Response))
      .catch(err => {
        this.logger.error(err);
        return cb(err);
      });
  }
}
