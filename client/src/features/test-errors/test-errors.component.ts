import { HttpClient } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { RegisterRequest } from "../../types";

@Component({
  imports: [],
  selector: "app-test-errors",
  templateUrl: "./test-errors.component.html",
})
export class TestErrors {
  private http = inject(HttpClient);
  private baseUrl = "https://localhost:8000/api";

  protected validationErrors = signal<string[]>([]);

  protected get400Error() {
    this.http.get(`${this.baseUrl}/buggy/bad-request`).subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  protected get400ValidationError() {
    this.http
      .post(`${this.baseUrl}/account/register`, { "display-name": "", email: "", password: "" })
      .subscribe({
        next: response => console.log(response),
        error: error => {
          console.log(error);
          this.validationErrors.set(error);
        },
      });
  }

  protected get401Error() {
    this.http.get(`${this.baseUrl}/buggy/auth`).subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  protected get404Error() {
    this.http.get(`${this.baseUrl}/buggy/not-found`).subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }

  protected get500Error() {
    this.http.get(`${this.baseUrl}/buggy/server-error`).subscribe({
      next: response => console.log(response),
      error: error => console.log(error),
    });
  }
}
