import { Component, input } from "@angular/core";
import { Member } from "@types";

@Component({
  imports: [],
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
})
export class MemberCard {
  public member = input.required<Member>();
}
