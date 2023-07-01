import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { StockService } from './stock.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Stock Prophet';

  selectedModel: string = "LinearRegression";
  selectedPeriod: string = "hourly";
  stockCode: string = "AMZN"

  public openChart: any;
  public closeChart: any;
  public highChart: any;
  public lowChart: any;
  public volumeChart: any;

  private chartOptions = {
    aspectRatio:2.5,
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          color: '#FFFFFF',
          font: {
            size: 14
          }
        },
        grid: {
          color: '#1E1E1E'
        }
      },
      y: {
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 14
          }
        },
        grid: {
          color: '#1E1E1E'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          font: {
            size: 18
          }
        }
      }
    }
  }

  constructor(private stockService: StockService) {

  }

  ngOnInit(): void {

  }

  createChart(id: string, labels: string[], customPredictions: number[], libraryPredictions: number[], actualValues: number[]) {
    const chart = new Chart(id, {
      type: 'line',

      data: {// values on X-Axis
        labels: labels, 
	       datasets: [
          {
            label: "Custom Prediction",
            data: customPredictions,
            borderColor: '#087E8B',
            fill: false
            
          },
          {
            label: "Library Prediction",
            data: libraryPredictions,
            borderColor: '#FF6B35',
            fill: false
            
          },
          {
            label: "Actual",
            data: actualValues,
            borderColor: '#81E979',
            fill: false
          }  
        ]
      },
      options: this.chartOptions   
    });
    switch(id) {
      case "OpenChart":
        this.openChart = chart;
        break;
      case "CloseChart":
        this.closeChart = chart;
        break;
      case "HighChart":
        this.highChart = chart;
        break;
      case "LowChart":
        this.lowChart = chart;
        break;
      case "VolumeChart":
        this.volumeChart = chart;
        break;
      default:
        console.error("Unknown chart id:", id);
    }
  }

  predict() {
    this.destroyCharts();
    if (this.selectedModel==="LinearRegression") {
      this.stockService.getLinearRegressionPredictions(this.stockCode, this.selectedPeriod).subscribe({
        next: value => {
          this.createAllCharts(value);
        }
      });
    }
  }

  createAllCharts(response: MyResponse) {
    const dateStrings: string[] = response.dates.map((timestamp) => {
      const date = new Date(timestamp * 1000);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      return date.toLocaleString(undefined, options);
    });
    
    this.createChart("OpenChart", dateStrings, response.open.predictedCustom, response.open.predictedLibrary, response.open.actual);
    this.createChart("CloseChart", dateStrings, response.close.predictedCustom, response.close.predictedLibrary, response.close.actual);
    this.createChart("HighChart", dateStrings, response.high.predictedCustom, response.high.predictedLibrary, response.high.actual);
    this.createChart("LowChart", dateStrings, response.low.predictedCustom, response.low.predictedLibrary, response.low.actual);
    this.createChart("VolumeChart", dateStrings, response.volume.predictedCustom, response.volume.predictedLibrary, response.volume.actual);
  }

  destroyCharts() {
    if (this.openChart) {
      this.openChart.destroy();
    }
    if (this.closeChart) {
      this.closeChart.destroy();
    }
    if (this.highChart) {
      this.highChart.destroy();
    }
    if (this.lowChart) {
      this.lowChart.destroy();
    }
    if (this.volumeChart) {
      this.volumeChart.destroy();
    }
  }

}

export interface MyResponse {
  companyCode: string;
  period: string;
  dates: number[];
  open: {
    predictedCustom: number[];
    predictedLibrary: number[];
    errorCustom: number;
    errorLibrary: number;
    actual: number[];
  };
  close: {
    predictedCustom: number[];
    predictedLibrary: number[];
    errorCustom: number;
    errorLibrary: number;
    actual: number[];
  };
  high: {
    predictedCustom: number[];
    predictedLibrary: number[];
    errorCustom: number;
    errorLibrary: number;
    actual: number[];
  };
  low: {
    predictedCustom: number[];
    predictedLibrary: number[];
    errorCustom: number;
    errorLibrary: number;
    actual: number[];
  };
  volume: {
    predictedCustom: number[];
    predictedLibrary: number[];
    errorCustom: number;
    errorLibrary: number;
    actual: number[];
  };
}

