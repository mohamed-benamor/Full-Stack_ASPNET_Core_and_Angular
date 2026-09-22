import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Member } from "../types";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected members = signal<Member[]>([]);

  async ngOnInit() {
    // this.http.get("https://localhost:8000/api/members").subscribe({
    //   next: (response) => console.log(response),
    //   error: (error) => console.log(error),
    //   complete: () => console.log("Completed http request"),
    // });

    this.members.set(await this.getMembers());
  }

  async getMembers() {
    try {
      return await lastValueFrom(this.http.get<Member[]>("https://localhost:8000/api/members"));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
