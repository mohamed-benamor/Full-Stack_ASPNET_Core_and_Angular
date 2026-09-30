import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { environment } from "@environments";
import { LoginRequest, RegisterRequest, User, UserResponse } from "@types";
import { tap } from "rxjs";

@Service()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public currentUser = signal<User | null>(null);

  private toUser(user: UserResponse): User {
    return {
      id: user["id"],
      displayName: user["display-name"],
      email: user["email"],
      token: user["token"],
      imageUrl: user["image-url"],
    };
  }

  public setCurrentUser(user: User) {
    this.currentUser.set(user);

    localStorage.setItem("user", JSON.stringify(this.currentUser()));
  }

  public register(credentials: RegisterRequest) {
    return this.http.post<UserResponse>(`${this.baseUrl}/account/register`, credentials).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(this.toUser(user));
        }
      }),
    );
  }

  public login(credentials: LoginRequest) {
    return this.http.post<UserResponse>(`${this.baseUrl}/account/login`, credentials).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(this.toUser(user));
        }
      }),
    );
  }

  public logout() {
    this.currentUser.set(null);
    localStorage.removeItem("user");
  }
}
