import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, signal } from "@angular/core";
import { lastValueFrom, map } from "rxjs";
import { Nav } from "../layout/nav/nav";
import { Member, MemberResponse } from "../types";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [Nav],
})
export class App implements OnInit {
  private http = inject(HttpClient);
  protected title = signal("Members");
  protected members = signal<Member[]>([]);

  async ngOnInit() {
    // this.http.get("https://localhost:8000/api/members").subscribe({
    //   next: (response) => console.log(response),
    //   error: (error) => console.log(error),
    //   complete: () => console.log("Completed http request"),
    // });

    this.members.set(await this.getMembers());
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
