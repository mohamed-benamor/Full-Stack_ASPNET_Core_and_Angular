import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import { LoginRequest, RegisterRequest, User } from "@types";
import { tap } from "rxjs";
import { LikesService } from "./likes.service";

@Service()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly likesService = inject(LikesService);
  private readonly baseUrl = environment.apiUrl;

  public readonly currentUser = signal<User | null>(null);

  public setCurrentUser(user: User) {
    this.currentUser.set(user);
    this.likesService.getLikeIds();
    localStorage.setItem("user", JSON.stringify(this.currentUser()));
  }

  public register(credentials: RegisterRequest) {
    const body = {
      ...credentials,
      "display-name": credentials["displayName"],
      "date-of-birth": credentials["dateOfBirth"],
    };

    return this.http.post<User>(`${this.baseUrl}/account/register`, body).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  public login(credentials: LoginRequest) {
    return this.http.post<User>(`${this.baseUrl}/account/login`, credentials).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  public logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("filters");
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
  }
}
