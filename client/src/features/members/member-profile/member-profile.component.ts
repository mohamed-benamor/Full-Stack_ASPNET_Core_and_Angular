import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Member } from "@types";

@Component({
  imports: [],
  selector: "app-member-profile",
  templateUrl: "./member-profile.component.html",
})
export class MemberProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data["member"]);
    });
  }
}
