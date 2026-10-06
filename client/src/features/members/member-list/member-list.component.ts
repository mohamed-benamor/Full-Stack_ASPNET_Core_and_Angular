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
  private updatedParams = new MemberParams();

  protected readonly paginatedMembers = signal<PaginationResult<Member> | null>(null);

  get displayedMessage(): string {
    const defaultParams = new MemberParams();

    const filters: string[] = [];

    if (this.updatedParams.gender) {
      filters.push(`${this.updatedParams.gender}s`);
    } else {
      filters.push("Males, Females");
    }

    if (
      this.updatedParams.minAge !== defaultParams.minAge ||
      this.updatedParams.maxAge !== defaultParams.maxAge
    ) {
      filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }

    filters.push(
      this.updatedParams.orderBy === "lastActive" ? "Recently active" : "Newest members",
    );

    return filters.length > 0 ? `Selected: ${filters.join(" | ")}` : "All members";
  }

  public ngOnInit(): void {
    this.loadMembers();
  }

  protected onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  protected openModal() {
    this.modal.open();
  }

  protected onClose() {
    console.log("Modal closed");
  }

  protected onFilterChange(data: MemberParams) {
    this.memberParams = { ...data };
    this.updatedParams = { ...data };
    this.loadMembers();
  }

  protected resetFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers();
  }

  private loadMembers() {
    this.service.getMembers(this.memberParams).subscribe({
      next: response => this.paginatedMembers.set(response),
    });
  }
}
