import { Param } from './gama-param';
import { Output } from './output';

export class Simulation {

    id: number;
    sourcePath: string;
    finalStep: number;
    experiment: string;
    seed: number;
    folderName: string;

    parameters: Array<Param>;

    outputs: Array<Output>;

    constructor(id?: number, sourcePath?: string, finalStep?: number, experiment?: string, seed?: number, folderName?: string) {
        this.id = id;
        this.sourcePath = sourcePath;
        this.finalStep = finalStep;
        this.experiment = experiment;
        this.seed = seed;
        this.folderName = folderName;
    }
}