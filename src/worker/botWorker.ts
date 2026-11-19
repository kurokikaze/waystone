// @/src/worker/botWorker.ts

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import {WorkerStrategyConnector} from 'bechamel/worker'
import {SimulationStrategy} from 'bechamel';

import { configureDiagnostics } from 'bechamel';
import { ErrorDumpService } from '../services/ErrorDumpService';
configureDiagnostics(ErrorDumpService);

const strategyConnector = new WorkerStrategyConnector()

strategyConnector.connect(new SimulationStrategy())