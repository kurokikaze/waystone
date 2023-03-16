// @/src/worker/botWorker.ts

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import {WorkerStrategyConnector} from '../bechamel/WorkerStrategyConnector'
import {SimulationStrategy} from '../bechamel/strategies/SimulationStrategy';

const strategyConnector = new WorkerStrategyConnector()

strategyConnector.connect(new SimulationStrategy())