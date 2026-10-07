import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import { LikesParams, Member, PaginationResult } from "@types";

@Service()
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  public readonly likeIds = signal<string[]>([]);

  public toggleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}/likes/${targetMemberId}`, {});
  }

  public getLikes(likesParams: LikesParams) {
    let params = new HttpParams();

    params = params.append("pageNumber", likesParams.pageNumber);
    params = params.append("pageSize", likesParams.pageSize);
    params = params.append("predicate", likesParams.predicate);

    return this.http.get<PaginationResult<Member>>(`${this.baseUrl}/likes`, { params });
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
