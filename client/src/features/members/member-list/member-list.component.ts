import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Member, PaginationResult } from "@types";
import { Observable } from "rxjs";
import { MemberCard } from "../member-card/member-card.component";

@Component({
  imports: [AsyncPipe, MemberCard],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList {
  private readonly service = inject(MemberService);

  protected readonly $paginatedMembers: Observable<PaginationResult<Member>>;

  constructor() {
    this.$paginatedMembers = this.service.getMembers();
  }
}
