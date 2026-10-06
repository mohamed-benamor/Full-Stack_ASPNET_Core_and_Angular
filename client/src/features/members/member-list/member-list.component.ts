import { Component, inject, OnInit, signal } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Paginator } from "@shared/paginator/paginator.component";
import { Member, MemberParams, PaginationResult } from "@types";
import { MemberCard } from "../member-card/member-card.component";

@Component({
  imports: [MemberCard, Paginator],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList implements OnInit {
  private readonly service = inject(MemberService);
  private memberParams = new MemberParams();

  protected readonly paginatedMembers = signal<PaginationResult<Member> | null>(null);

  public ngOnInit(): void {
    this.loadMembers();
  }

  protected onPageChange(event: { pageNumber: number, pageSize: number; }) {
    this.memberParams.pageNumber = event.pageNumber
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  private loadMembers() {
    this.service.getMembers(this.memberParams).subscribe({
      next: response => this.paginatedMembers.set(response)
    });
  }
}
