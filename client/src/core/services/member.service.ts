import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import { EditableMember, Member, MemberParams, PaginationResult, Photo } from "@types";
import { Observable, tap } from "rxjs";

@Service()
export class MemberService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  public editMode = signal(false);
  public member = signal<Member | null>(null);

  public getMembers(memberParams: MemberParams): Observable<PaginationResult<Member>> {
    let params = new HttpParams();

    params = params.append("orderBy", memberParams.orderBy);

    params = params.append("pageNumber", memberParams.pageNumber);
    params = params.append("minAge", memberParams.minAge);
    params = params.append("maxAge", memberParams.maxAge);
    params = params.append("pageNumber", memberParams.pageNumber);
    params = params.append("pageSize", memberParams.pageSize);

    if (memberParams.gender) {
      params = params.append("gender", memberParams.gender);
    }

    return this.http
      .get<PaginationResult<Member>>(`${this.baseUrl}/members`, { params })
      .pipe(tap(() => localStorage.setItem("filters", JSON.stringify(memberParams))));
  }

  public getMember(id: string): Observable<Member> {
    return this.http
      .get<Member>(`${this.baseUrl}/members/${id}`)
      .pipe(tap(member => this.member.set(member)));
  }

  public getMemberPhotos(id: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/members/${id}/photos`);
  }

  public updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}/members`, member);
  }

  public updatePhoto(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return this.http.post<Photo>(`${this.baseUrl}/members/add-photo`, formData);
  }

  public updateProfilePhoto(photo: Photo) {
    return this.http.put(`${this.baseUrl}/members/profile-photo/${photo.id}`, {});
  }

  public deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}/members/delete-photo/${photoId}`);
  }
}
