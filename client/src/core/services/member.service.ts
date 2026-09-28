import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "@environments";
import { Member, MemberResponse, Photo, PhotoResponse } from "@types";
import { AccountService } from "./account.service";
import { map, Observable } from "rxjs";

@Service()
export class MemberService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);

  public getMembers(): Observable<Member[]> {
    return this.http
      .get<MemberResponse[]>(`${this.baseUrl}/members`)
      .pipe(map(members => members.map<Member>(this.toMember)));
  }

  public getMember(id: string): Observable<Member> {
    return this.http.get<MemberResponse>(`${this.baseUrl}/members/${id}`).pipe(map(this.toMember));
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

  private toMember(response: MemberResponse): Member {
    return {
      id: response["id"],
      displayName: response["display-name"],
      email: response["email"],
      gender: response["gender"],
      city: response["city"],
      country: response["country"],
      dateOfBirth: response["date-of-birth"],
      description: response["description"],
      imageUrl: response["image-url"],
      created: response["created"],
      lastActive: response["last-active"],
    };
  }
}
