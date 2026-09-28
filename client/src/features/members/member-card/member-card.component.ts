import { Component, input } from "@angular/core";
import { Member } from "@types";
import { RouterLink } from "@angular/router";

@Component({
  imports: [RouterLink],
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
})
export class MemberCard {
  public member = input.required<Member>();
}
