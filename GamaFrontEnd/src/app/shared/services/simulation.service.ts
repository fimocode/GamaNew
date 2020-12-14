import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from '../entity/result';
import { Output } from '../entity/output';
import { Simulation } from '../entity/simulation';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SimulationService {
    urlXmlFile = "/api/simulation";
    constructor(private http: HttpClient) { }

  createXmlFile(simulation: Simulation) {
    return this.http.post(`${this.urlXmlFile}/createFileXml`, simulation);
  }

  runXmlFile(result: Result) {
    return this.http.post(`${this.urlXmlFile}/runFileXml`, result);
  }

  runMap(output: Output): Observable<Output> {
    return this.http.post<Output>(`${this.urlXmlFile}/map`, output);
  }
 
}