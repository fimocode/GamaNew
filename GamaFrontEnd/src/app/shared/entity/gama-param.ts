export class Param {
    id: Number;
    name: string;
    type: string;
    value: string;
    gamaFileId: Number;

    constructor(name?: string, type?: string, value?: string, gamaFileId?: Number) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.gamaFileId = gamaFileId;
    }
}