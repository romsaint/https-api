import { Injectable } from '@nestjs/common';
import * as os from 'os'
const cluster = require('node:cluster')


@Injectable()
export class AppClusterService {
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting`);
        cluster.fork();
      });

      cluster.on('listening', (worker, address) => {
        console.log(`Worker ${worker.process.pid} is listening on ${address.address}:${address.port}`);
      });

      cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
      });
    } else {
      console.log(`Worker server started on ${process.pid}`);
      callback();
    }
  }
}