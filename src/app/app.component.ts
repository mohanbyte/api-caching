// app.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'api-caching';
  result: any;
  isLoading = false; // To track the loading state

  constructor(private httpRequest: HttpClient) {}
  i = 1;
  ngOnInit() {
    this.fetchData();
  }

  // Method to fetch data
  fetchData() {
    this.isLoading = true; // Start loading
    this.httpRequest
      .get('https://jsonplaceholder.typicode.com/todos/' + this.i)
      .subscribe((res) => {
        console.log(res);
        this.result = res;
        setTimeout(() => {
          this.isLoading = false; // Stop loading
        });
      });
  }

  // Method to fetch new data
  updateData() {
    this.i += 1;
    this.fetchData();
  }
  lastData() {
    this.i -= 1;
    this.fetchData();
  }
}
