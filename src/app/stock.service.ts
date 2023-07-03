import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { MyResponse } from './app.component';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  domain: string = "http://localhost:5000/"

  constructor(private http: HttpClient) { }

  getLinearRegressionPredictions(companyCode: string, period: string): Observable<MyResponse> {
    return this.http.get<MyResponse>(this.domain + "linear/" + companyCode + "/" + period);
  }

  getNeuralNetworkPredictions(companyCode: string, period: string): Observable<MyResponse> {
    return this.http.get<MyResponse>(this.domain + "neural-network/" + companyCode + "/" + period);
  }

  getDecisionTreePredictions(companyCode: string, period: string): Observable<MyResponse> {
    return this.http.get<MyResponse>(this.domain + "decision-tree/" + companyCode + "/" + period);
  }
  
  getSupportVectorMachinePredictions(companyCode: string, period: string): Observable<MyResponse> {
    return this.http.get<MyResponse>(this.domain + "svm/" + companyCode + "/" + period);
  }
}
