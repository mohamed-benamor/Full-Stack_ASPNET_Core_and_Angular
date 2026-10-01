import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import {
  EditableMember,
  Member,
  MemberBodyRequest,
  MemberResponse,
  Photo,
  PhotoResponse,
} from "@types";
import { map, Observable, tap } from "rxjs";

@Service()
export class MemberService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  public editMode = signal(false);
  public member = signal<Member | null>(null);

  public getMembers(): Observable<Member[]> {
    return this.http
      .get<MemberResponse[]>(`${this.baseUrl}/members`)
      .pipe(map(members => members.map<Member>(this.toMember)));
  }

  public getMember(id: string): Observable<Member> {
    return this.http
      .get<MemberResponse>(`${this.baseUrl}/members/${id}`)
      .pipe(map(this.toMember))
      .pipe(tap(member => this.member.set(member)));
  }

  public getMemberPhotos(id: string): Observable<Photo[]> {
    return this.http.get<PhotoResponse[]>(`${this.baseUrl}/members/${id}/photos`).pipe(
      map(photos =>
        photos.map(photo => ({
          id: photo["id"],
          url: photo["url"],
          publicId: photo["public-id"],
        })),
      ),
    );
  }

  public updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}/members`, this.toRequest(member));
  }

  public updatePhoto(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return this.http.post<Photo>(`${this.baseUrl}/members/add-photo`, formData);
  }

  private toMember(response: MemberResponse): Member {
    return {
      ...response,
      displayName: response["display-name"],
      dateOfBirth: response["date-of-birth"],
      imageUrl: response["image-url"],
      lastActive: response["last-active"],
    };
  }

  private toRequest(member: EditableMember): MemberBodyRequest {
    return {
      ...member,
      "display-name": member.displayName,
    };
  }
}
