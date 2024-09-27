import { Injectable } from '@nestjs/common';
import * as os from 'os'
const cluster = require('node:cluster')


@Injectable()
export class AppClusterService {
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
      });

    } else {
      callback();
    }
  }
}