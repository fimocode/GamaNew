export class Output {
    id: number;
    name: string;
    frameRate: number;
    urlImage: Array<string>;

    constructor(id?: number, name?: string, frameRate?: number, urlImage?: Array<string>) {
        this.id = id;
        this.name = name;
        this.frameRate = frameRate;
        this.urlImage = urlImage;
    }
}