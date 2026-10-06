import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Member, PaginationResult } from "@types";
import { Observable } from "rxjs";
import { MemberCard } from "../member-card/member-card.component";
import { Paginator } from "@shared/paginator/paginator.component";

@Component({
  imports: [AsyncPipe, MemberCard, Paginator],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList {
  private readonly service = inject(MemberService);
  private pageNumber = 1;
  private pageSize = 5;

  protected $paginatedMembers?: Observable<PaginationResult<Member>>;

  constructor() {
    this.loadMembers();
  }

  protected onPageChange(event: { pageNumber: number, pageSize: number; }) {
    this.pageNumber = event.pageNumber
    this.pageSize = event.pageSize;
    this.loadMembers();
  }

  private loadMembers() {
    this.$paginatedMembers = this.service.getMembers(this.pageNumber, this.pageSize);
  }
}
