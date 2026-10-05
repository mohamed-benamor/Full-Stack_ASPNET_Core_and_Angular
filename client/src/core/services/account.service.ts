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

  public setCurrentUser(user: User) {
    this.currentUser.set(user);

    localStorage.setItem("user", JSON.stringify(this.currentUser()));
  }

  public register(credentials: RegisterRequest) {
    const body = {
      ...credentials,
      "display-name": credentials["displayName"],
      "date-of-birth": credentials["dateOfBirth"],
    };

    return this.http.post<UserResponse>(`${this.baseUrl}/account/register`, body).pipe(
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

  private toUser(user: UserResponse): User {
    return {
      id: user["id"],
      displayName: user["display-name"],
      email: user["email"],
      token: user["token"],
      imageUrl: user["image-url"],
    };
  }
}
