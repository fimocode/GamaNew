import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GamaFile } from 'src/app/shared/entity/gama-file';
import { GamaFileService } from 'src/app/shared/services/gama-file.service';

@Component({
  selector: 'app-dialog-gama-file',
  templateUrl: './dialog-gama-file.component.html',
  styleUrls: ['./dialog-gama-file.component.css']
})
export class DialogGamaFileComponent implements OnInit {

  isErrorName: boolean;
  fileName: string;

  constructor(public dialogRef: MatDialogRef<DialogGamaFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private gameFileService: GamaFileService) {
    this.fileName = data.gamaFile.name;
   }

  ngOnInit() {
  }

  save() {
    this.isErrorName = !this.fileName || (this.fileName && this.fileName.trim() === '');
    if (this.isErrorName) {
      this.fileName = '';
      document.getElementById('name').focus();
      return;
    }
    const gamaFile = new GamaFile();
    gamaFile.name = this.fileName;
    gamaFile.projectId = +localStorage.getItem('projectId');
    gamaFile.name = this.fileName;
    gamaFile.path = this.fileName;
    gamaFile.finalStep = 500;
    gamaFile.folderName = gamaFile.name.substring(0, gamaFile.name.indexOf('.gaml'));
    gamaFile.content = '';
    this.gameFileService.addGamaFile(gamaFile).subscribe(gamaFileData => {
      this.dialogRef.close(gamaFileData);
    });
  }
}

export interface DialogData {
  gamaFile: GamaFile;
}
