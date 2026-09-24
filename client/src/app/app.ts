import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";
import { lastValueFrom, map } from "rxjs";
import { Nav } from "../layout/nav/nav";
import { Member, MemberResponse } from "../types";
import { AccountService } from "../core/services/account-service";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [Nav, RouterOutlet],
})
export class App implements OnInit {
  private service = inject(AccountService);
  private http = inject(HttpClient);

  protected members = signal<Member[]>([]);
  protected router = inject(Router);

  async ngOnInit() {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem("user");

    if (!userString) {
      return;
    }

    const user = JSON.parse(userString);

    this.service.currentUser.set(user);
  }

  async getMembers(): Promise<Member[]> {
    try {
      return await lastValueFrom(
        this.http.get<MemberResponse[]>("https://localhost:8000/api/members").pipe(
          map((members) => {
            return members.map(
              (member) =>
                ({
                  id: member["id"],
                  displayName: member["display-name"],
                  imageUrl: member["image-url"] ?? "/user.png",
                }) satisfies Member,
            );
          }),
        ),
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
