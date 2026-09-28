import { Component, input } from "@angular/core";
import { Member } from "@types";
import { RouterLink } from "@angular/router";
import { AgePipe } from "@pipes/age.pipe";

@Component({
  imports: [RouterLink, AgePipe],
  selector: "app-member-card",
  templateUrl: "./member-card.component.html",
})
export class MemberCard {
  public member = input.required<Member>();
}
