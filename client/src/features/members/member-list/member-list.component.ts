import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { MemberService } from "@services/member.service";
import { Paginator } from "@shared/paginator/paginator.component";
import { Member, MemberParams, PaginationResult } from "@types";
import { MemberCard } from "@features/members/member-card/member-card.component";
import { FilterModal } from "@features/members/filter-modal/filter-modal.component";

@Component({
  imports: [MemberCard, Paginator, FilterModal],
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
})
export class MemberList implements OnInit {
  @ViewChild("filterModal") private modal!: FilterModal;
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

  protected openModal() {
    this.modal.open();
  }

  protected onClose() {
    console.log("Modal closed")
  }

  protected onFilterChange(data: MemberParams) {
    this.memberParams = data;
    this.loadMembers();
  }

  protected resetFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers();
  }

  private loadMembers() {
    this.service.getMembers(this.memberParams).subscribe({
      next: response => this.paginatedMembers.set(response)
    });
  }
}
