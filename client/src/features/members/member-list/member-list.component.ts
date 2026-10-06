import { Component, inject, OnInit, signal } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Paginator } from "@shared/paginator/paginator.component";
import { Member, PaginationResult } from "@types";
import { MemberCard } from "../member-card/member-card.component";

@Component({
  imports: [MemberCard, Paginator],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList implements OnInit {
  private readonly service = inject(MemberService);
  private pageNumber = 1;
  private pageSize = 5;

  protected readonly paginatedMembers = signal<PaginationResult<Member> | null>(null);

  public ngOnInit(): void {
    this.loadMembers();
  }

  protected onPageChange(event: { pageNumber: number, pageSize: number; }) {
    this.pageNumber = event.pageNumber
    this.pageSize = event.pageSize;
    this.loadMembers();
  }

  private loadMembers() {
    this.service.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: response => this.paginatedMembers.set(response)
    });
  }
}
