import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, of } from 'rxjs';
import { mergeMap, map, pluck, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'calculator';
  numbers: { value: number; action: string; id: number }[] = [];
  finalResult: any[] = [1];
  errorMsg!: string;
  hasServerError: boolean = false;

  handelDataError(id: number) {
    this.finalResult[id] = {
      firstValue: null,
      action: '',
      equal: '',
      secondValue: null,
      result: null,
      dataErrMsg: 'MISSING DATA',
    };
  }

  addOperation(value: number, id: number) {
    this.httpClient.get('assets/Add.json').subscribe((numbers: any) => {
      const result = numbers.value + value;
      return (this.finalResult[id] = {
        firstValue: value,
        action: '+',
        secondValue: numbers.value,
        equal: '=',
        result: result,
        dataErrMsg: '',
      });
    });
  }

  multiplyOperation(value: number, id: number) {
    this.httpClient.get('assets/Multiply.json').subscribe((numbers: any) => {
      const result = numbers.value * value;
      this.finalResult[id] = {
        firstValue: value,
        action: '*',
        secondValue: numbers.value,
        equal: '=',
        result: result,
        dataErrMsg: '',
      };
    });
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get('assets/Numbers.json')
      .pipe(
        catchError((error: any) => {
          this.hasServerError = true;
          this.errorMsg = error.message;
          return of([]);
        })
      )
      .subscribe((numbers: any) => {
        this.numbers = numbers;
        console.log(numbers);
        this.numbers.map(
          (item: { value: number; action: string; id: number }) => {
            if (item.action === 'add') {
              this.addOperation(item.value, item.id);

            } else if (item.action == 'multiply') {
              this.multiplyOperation(item.value, item.id);

            } else if (item.action == undefined || item.action === '') {
              this.handelDataError(item.id);
            }
          }
        );
        
      });
  }
}
