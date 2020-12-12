export class GamaFile {
    id: Number;
    name: string;
    content: string;
    path: string;
    outputName: string;
    finalStep: number;
    folderName: string;
    projectId: Number;

    constructor(id?: Number, name?: string, content?: string, path?: string, outputName?: string, finalStep?: number, folderName?: string, projectId?: Number) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.path = path;
        this.outputName = outputName;
        this.finalStep = finalStep;
        this.folderName = folderName;
        this.projectId = projectId;
    }
}