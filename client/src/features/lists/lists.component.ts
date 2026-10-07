import { Component, inject, OnInit, signal } from "@angular/core";
import { LikesService } from "@services/likes.service";
import { LikesParams, Member, PaginationResult } from "@types";
import { MemberCard } from "@features/members/member-card/member-card.component";
import { Paginator } from "@shared/paginator/paginator.component";

@Component({
  imports: [MemberCard, Paginator],
  selector: "app-lists",
  templateUrl: "./lists.component.html",
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);

  protected readonly paginatedMembers = signal<PaginationResult<Member> | null>(null);
  protected readonly likesParams = new LikesParams();
  protected tabs = [
    { label: "Liked", value: "liked" },
    { label: "Liked me", value: "likedBy" },
    { label: "Mutual", value: "mutual" },
  ];

  public ngOnInit() {
    this.loadLikes();
  }

  protected setPredicate(predicate: string) {
    if (predicate) {
      this.likesParams.predicate = predicate;
      this.loadLikes();
    }
  }

  protected onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.likesParams.pageNumber = event.pageNumber;
    this.likesParams.pageSize = event.pageSize;
    this.loadLikes();
  }

  private loadLikes() {
    this.likesService.getLikes(this.likesParams).subscribe({
      next: response => this.paginatedMembers.set(response),
    });
  }
}
