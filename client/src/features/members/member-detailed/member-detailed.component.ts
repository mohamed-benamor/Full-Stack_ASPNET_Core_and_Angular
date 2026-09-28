import { AsyncPipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { MemberService } from "@services/member.service";
import { Member } from "@types";
import { Observable } from "rxjs";
import { NotFound } from "@shared/errors/not-found/not-found.component";

@Component({
  imports: [AsyncPipe, RouterLink, RouterLinkActive, NotFound],
  selector: "app-member-detailed",
  templateUrl: "./member-detailed.component.html",
})
export class MemberDetailed implements OnInit {
  private readonly service = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  protected $member?: Observable<Member>;

  ngOnInit(): void {
    this.$member = this.loadMember();
  }

  private loadMember() {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      return;
    }

    return (this.$member = this.service.getMember(id));
  }
}
