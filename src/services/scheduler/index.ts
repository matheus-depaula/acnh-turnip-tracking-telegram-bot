import scheduler, { Job } from 'node-schedule';
import { Logger } from '../logger';

export class Scheduler {
  public jobs!: Job[];
  private logger!: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
    this.jobs = [];
  }

  public addJob(id: string | number, rule: string, callback: () => void) {
    const name = id.toString();
    const job = scheduler.scheduleJob(name, rule, callback);

    this.jobs.push(job);
  }

  public removeJob(id: string | number) {
    const name = id.toString();
    const job = this.jobs.find(j => j.name === name);

    if (!job) return this.logger.warn(`Job '${name}' not found.`);

    job.cancel();
    this.jobs = this.jobs.filter(j => j.name === name);
  }
}
