import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import { Member } from "@types";

@Service()
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  public readonly likeIds = signal<string[]>([]);

  public toggleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}/likes/${targetMemberId}`, {});
  }

  public getLikes(predicate: string) {
    return this.http.get<Member[]>(`${this.baseUrl}/likes?predicate=${predicate}`);
  }

  public getLikeIds() {
    this.http.get<string[]>(`${this.baseUrl}/likes/list`).subscribe({
      next: ids => this.likeIds.set(ids),
    });
  }

  public clearLikeIds() {
    this.likeIds.set([]);
  }
}
