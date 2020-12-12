import { GamaParamService } from './../../shared/services/gama-param.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { GamaFile } from 'src/app/shared/entity/gama-file';
import { GamaFileService } from 'src/app/shared/services/gama-file.service';
import { Param } from 'src/app/shared/entity/gama-param';
import { Simulation } from 'src/app/shared/entity/simulation';
import { Output } from 'src/app/shared/entity/output';
import { SimulationService } from 'src/app/shared/services/simulation.service';
import { Result } from 'src/app/shared/entity/result';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DialogGamaFileComponent } from '../component/dialog/dialog-gama-file/dialog-gama-file.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gama-file',
  templateUrl: './gama-file.component.html',
  styleUrls: ['./gama-file.component.css']
})
export class GamaFileComponent implements OnInit {

  isShow: boolean;
  isOpenGraph: boolean;
  isOpenModel: boolean;
  isOpenInteractive: boolean;
  isOpenConsole: boolean;
  listFiles: Array<GamaFile>;
  fileSelected: GamaFile;
  projectId: Number;
  contentFile: string;
  projectName: string;

  constructor(private gameFileService: GamaFileService, private gamaParamService: GamaParamService,
    private gameParamService: GamaParamService, private simulationService: SimulationService,
    private router: Router, private route: ActivatedRoute, private dialogService: DialogService,
    private toastr: ToastrService) {
    if (localStorage.getItem('projectId')) {
      this.projectId = +localStorage.getItem('projectId');
      this.projectName = localStorage.getItem('projectName');
    }
  }

  ngOnInit(): void {
    this.isOpenGraph = true;
    this.listFiles = new Array<GamaFile>();
    this.getListFile();
  }

  showControls() {
    this.isShow = !this.isShow;
  }

  openGraph() {
    this.isOpenGraph = true;
    this.isOpenModel = false;
  }

  openModel() {
    this.isOpenModel = true;
    this.isOpenGraph = false;
    this.isRunFile = false;
    this.clearIntervalList(this.intervalListImage);
    this.clearIntervalList(this.intervalListChart);
    this.clearIntervalList(this.intervalListMessage);
    this.index = 0;
    this.messageIndex = 0;
    this.indexChart = 0;
  }

  openInteractive() {
    this.isOpenInteractive = true;
    this.isOpenConsole = false;
  }

  openConsole() {
    this.isOpenInteractive = false;
    this.isOpenConsole = true;
  }

  selectFile(file: GamaFile) {
    this.fileSelected = file;
    this.contentFile = file.content;
    this.listParams = new Array<Param>();
    this.gameParamService.getGamaParamsByFileId(file.id).subscribe(data => {
      this.listParams = data;
    });
  }

  /**
   * import media
   */
  importMedia(event: any) {
    let element = document.getElementById("importedFile") as HTMLInputElement;
    element.click();
  }

  keyCodeMap = {
    17: false, // Ctrl
    18: false, // Alt
    83: false, // S
  };
  /**
     *
     * @param e
     */
  @HostListener("document:keydown", ["$event"])
  keyDown(e) {
    if (e.keyCode in this.keyCodeMap) {
      this.keyCodeMap[e.keyCode] = true;
      // save data
      if (this.keyCodeMap[17] && this.keyCodeMap[18] && this.keyCodeMap[83]) {
        this.saveData();
      }
    }
  }

  @HostListener("document:keyup", ["$event"])
  keyUp(e) {
    if (e.keyCode == 17) {
      this.keyCodeMap[17] = false;
    }
    if (e.keyCode == 18) {
      this.keyCodeMap[18] = false;
    }
    if (e.keyCode == 83) {
      this.keyCodeMap[83] = false;
    }
  }

  saveData() {
    this.fileSelected.content = this.contentFile;
    this.gameFileService.editGamaFile(this.fileSelected).subscribe(data => {
      let index = this.listFiles.findIndex(fileData => fileData.id == data.id);
      if (index != -1) {
        this.listFiles[index] = data;
        this.selectFile(this.listFiles[index]);
      }
      this.gamaParamService.editParams(this.listParams).subscribe(dataParam => {
        this.listParams = dataParam;
        this.saveChangeFileXML();
        let fileName = this.fileSelected.name.substring(0, this.fileSelected.name.indexOf('.'));
        let folderIn = "../Samples/" + fileName;
        let folderOut = "../GamaFrontEnd/src/assets/";
        let result = new Result(folderIn + "/" + fileName + ".xml", folderOut + fileName);
        this.simulationService.runXmlFile(result).subscribe( data => {
          this.toastr.success("Save successful.")
        }
        );
      });
    })

  }

  saveChangeFileXML() {
    this.listParams = new Array<Param>();
    let outputs = new Array<Output>();
    var outputIndex = 0;
    for (const line of this.fileSelected.content.split(/[\r\n]+/)) {
      if (line.includes('experiment')) {
        let arrayChar = line.split(' ');
        let experiment = arrayChar[1];
        var simulation = new Simulation(1, "./models/" + this.fileSelected.path, this.fileSelected.finalStep, experiment, 3, this.fileSelected.folderName);
      }
      if (line.includes('display ') && line.includes(' {')) {
        let arrayChar = line.split(' ');
        let display = arrayChar[1];
        this.fileSelected.outputName = display;
        outputIndex++;
        outputs.push(new Output(outputIndex, display, 5));
      }
      if (line.includes('monitor')) {
        let arrayString = line.split('"');
        let monitor = arrayString[1];
        outputIndex++;
        outputs.push(new Output(outputIndex, monitor, 5));
        let arrayMonitorEnd = arrayString[2].split(' ');
        let variable = arrayMonitorEnd[2].substring(0, arrayMonitorEnd[2].indexOf(';'))
        for (const line of this.fileSelected.content.split(/[\r\n]+/)) {
          if (line.includes('parameter') && line.includes(variable)) {
            let param = new Param();
            let arrayString = line.split('"');
            param.name = arrayString[1];
            let arrayEnd = arrayString[2].split(' ');
            param.typeName = arrayEnd[2];
            for (const line of this.fileSelected.content.split(/[\r\n]+/)) {
              if (line.includes(param.typeName + " <-")) {
                let array = line.split(' ');
                param.type = array[0].trim().toUpperCase();
                param.value = array[3].substring(0, array[3].indexOf(';'));
              }
            }
            this.listParams.push(param);
          }
        }
      }
    }
    if (simulation) {
      simulation.outputs = outputs;
    }
    if (this.listParams) {
      simulation.parameters = this.listParams;
    }
    this.simulationService.createXmlFile(simulation).subscribe();
  }

  getListFile() {
    this.gameFileService.getGamaFilesByProjectId(this.projectId).subscribe(data => {
      this.listFiles = data;
    })
  }

  listParams: Array<Param>;
  /**
   * upload media files
   * @param event
   */
  async upload(event: any) {
    let selectedFiles: any[] = event.target.files;

    // upload file
    for (const file of selectedFiles) {
      var f = file;
      var reader = new FileReader();
      reader.onload = this.processFile(f);
      reader.readAsText(f);
    }
  }

  processFile(theFile) {
    let $this = this;
    $this.listParams = new Array<Param>();
    var item = new GamaFile();
    item.name = theFile.name;
    item.path = theFile.name;
    item.folderName = item.name.substring(0, item.name.indexOf('.gaml'));
    return function (e) {
      var theBytes = e.target.result;
      item.content = theBytes;
      item.projectId = $this.projectId;
      item.finalStep = 500;
      let outputs = new Array<Output>();
      var outputIndex = 0;
      for (const line of theBytes.split(/[\r\n]+/)) {
        if (line.includes('experiment')) {
          let arrayChar = line.split(' ');
          let experiment = arrayChar[1];
          var simulation = new Simulation(1, "./models/" + item.path, item.finalStep, experiment, 3, item.folderName);
        }
        if (line.includes('display ') && line.includes(' {')) {
          let arrayChar = line.split(' ');
          let display = arrayChar[1];
          item.outputName = display;
          outputIndex++;
          outputs.push(new Output(outputIndex, display, 5));
        }
        if (line.includes('monitor')) {
          let arrayString = line.split('"');
          let monitor = arrayString[1];
          outputIndex++;
          outputs.push(new Output(outputIndex, monitor, 5));
          let arrayMonitorEnd = arrayString[2].split(' ');
          let variable = arrayMonitorEnd[2].substring(0, arrayMonitorEnd[2].indexOf(';'))
          for (const line of theBytes.split(/[\r\n]+/)) {
            if (line.includes('parameter') && line.includes(variable)) {
              let param = new Param();
              let arrayString = line.split('"');
              param.name = arrayString[1];
              let arrayEnd = arrayString[2].split(' ');
              param.typeName = arrayEnd[2];
              for (const line of theBytes.split(/[\r\n]+/)) {
                if (line.includes(param.typeName + " <-")) {
                  let array = line.split(' ');
                  param.type = array[0].trim().toUpperCase();
                  param.value = array[3].substring(0, array[3].indexOf(';'));
                }
              }
              $this.listParams.push(param);
            }
          }
        }
      }
      if (simulation) {
        simulation.outputs = outputs;
      }
      if ($this.listParams) {
        simulation.parameters = $this.listParams;
      }
      $this.gameFileService.addGamaFile(item).subscribe(data => {
        $this.listFiles.push(data);
        $this.listParams.map(param => param.fileId = data.id)
        $this.simulationService.createXmlFile(simulation).subscribe();
      });
    }
  }

  imageUrl: string;
  chartUrl: string;
  urlImages: Array<string>;
  urlCharts: Array<string>;
  messageConsoles: Array<string>;
  index = 0;
  messageIndex = 0;
  indexChart = 0;
  isRunFile = false;
  intervalListImage: Array<any> = new Array<any>();
  intervalListChart: Array<any> = new Array<any>();
  intervalListMessage: Array<any> = new Array<any>();

  stopFile() {
    this.isRunFile = false;
    this.clearIntervalList(this.intervalListImage);
    this.clearIntervalList(this.intervalListChart);
    this.clearIntervalList(this.intervalListMessage);
  }

  runFile() {
    this.isRunFile = true;
    this.isOpenGraph = true;
    this.isOpenModel = false;
    this.isOpenInteractive = false;
    this.isOpenConsole = true;
    this.urlImages = new Array<string>();
    this.urlCharts = new Array<string>();
    this.messageConsoles = new Array<string>();
    var fileName = this.fileSelected.name.substring(0, this.fileSelected.name.indexOf('.'));
    for (let i = 0; i < 200; i += 5) {
      this.urlImages.push(this.fileSelected.outputName + "1-" + i + ".png");
    }
    for (let i = 0; i < 200; i += 5) {
      this.urlCharts.push("Population_information1-" + i + ".png");
    }
    let $this = this;
    $this.imageUrl = `../../../assets/${fileName}/snapshot/${$this.urlImages[$this.index]}`;
    $this.messageConsoles.push(`Message at cycle ${$this.messageIndex}`);
    let imageInterval = setInterval(() => {
      if ($this.index >= $this.urlImages.length - 1) {
        $this.imageUrl = `../../../assets/${fileName}/snapshot/${$this.urlImages[$this.urlImages.length - 1]}`;
        clearInterval(imageInterval);
        return;
      }
      $this.index++;
      $this.imageUrl = `../../../assets/${fileName}/snapshot/${$this.urlImages[$this.index]}`;
    }, 300);
    this.intervalListImage.push(imageInterval);

    $this.chartUrl = `../../../assets/${fileName}/snapshot/${$this.urlCharts[$this.indexChart]}`;
    let chartInterval = setInterval(() => {
      if ($this.indexChart >= $this.urlCharts.length - 1) {
        $this.chartUrl = `../../../assets/${fileName}/snapshot/${$this.urlCharts[$this.urlCharts.length - 1]}`;
        clearInterval(chartInterval);
        return;
      }
      $this.indexChart++;
      $this.chartUrl = `../../../assets/${fileName}/snapshot/${$this.urlCharts[$this.indexChart]}`;
    }, 300);
    this.intervalListChart.push(chartInterval);
    let messageInterval = setInterval(() => {
      if ($this.messageIndex >= $this.fileSelected.finalStep - 1) {
        clearInterval(messageInterval);
        return;
      }
      $this.messageIndex++;
      $this.messageConsoles.push(`Message at cycle ${$this.messageIndex}`);
    }, 60);
    this.intervalListMessage.push(messageInterval);
  }

  clearIntervalList(intervalList: Array<any>) {
    intervalList.forEach(item => {
      clearInterval(item);
    })
  }

  isCreateNewFile: boolean = false;

  createNewFile() {
    let gamaFile = new GamaFile();
    this.dialogService.showDialog(DialogGamaFileComponent, { data: { gamaFile: gamaFile } },
      (result) => {
        if (result) {
          this.listFiles.push(result);
          this.isCreateNewFile = true;
          this.fileSelected = gamaFile;
        }
      });
  }

  backToHome() {
    this.router.navigate(['../homepage'], { relativeTo: this.route });
  }

  setFinalStep(value) {
    if(!this.fileSelected) {
      return;
    }
    this.fileSelected.finalStep = value;
  }

  ngOnDestroy(): void {
  }
}
