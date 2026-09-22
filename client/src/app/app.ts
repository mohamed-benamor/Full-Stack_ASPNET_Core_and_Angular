import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";

@Component({
  selector: "app-root",
  template: "",
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected readonly title = signal("client");

  ngOnInit(): void {
    this.http.get("https://localhost:8000/api/members").subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
      complete: () => console.log("Completed http request"),
    });
  }
}
