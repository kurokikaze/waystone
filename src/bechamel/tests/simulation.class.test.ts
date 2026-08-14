import { Simulation, type SimulationResult } from './simulation';

describe('Simulation class', () => {
    const buildSimulation = () => new Simulation({
        rng: 2053,
        writeLogs: false,
        playerOne: {
            name: 'Orothe Draft',
            cards: ['Whall'],
        },
        playerTwo: {
            name: 'Naroom Default',
            cards: ['Poad'],
        },
    });

    it('supports deck setup, run, and success subscription callbacks', () => {
        const simulation = buildSimulation();
        const result: SimulationResult = {
            winner: 1,
            winnerName: 'Orothe Draft',
            summary: {
                magiLeft: 1,
                energyLeft: 5,
                creaturesLeft: 0,
            },
            logs: {
                gameLog: [],
                playerOneLog: [],
                playerTwoLog: [],
            },
        };

        (simulation as any).execute = jest.fn(() => result);

        const next = jest.fn();
        const error = jest.fn();
        simulation.subscribe({ next, error });

        const runResult = simulation.run();

        expect(runResult).toEqual(result);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(result);
        expect(error).not.toHaveBeenCalled();
    });

    it('supports error subscription callbacks', () => {
        const simulation = buildSimulation();
        const next = jest.fn();
        const error = jest.fn();
        const thrownError = new Error('boom');

        (simulation as any).execute = jest.fn(() => {
            throw thrownError;
        });

        simulation.subscribe({ next, error });

        expect(() => simulation.run()).toThrow('boom');

        expect(next).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(thrownError);
    });
});
