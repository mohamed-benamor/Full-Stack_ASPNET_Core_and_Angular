import { HttpClient } from "@angular/common/http";
import { inject, Service, signal } from "@angular/core";
import { LoginRequest, User, UserResponse } from "../../types";
import { tap } from "rxjs";

@Service()
export class AccountService {
  private readonly baseUrl = "https://localhost:8000/api";
  private http = inject(HttpClient);

  public currentUser = signal<User | null>(null);

  public login(credentials: LoginRequest) {
    return this.http.post<UserResponse>(`${this.baseUrl}/account/login`, credentials).pipe(
      tap((user) => {
        if (user) {
          this.currentUser.set({
            id: user["id"],
            displayName: user["display-name"],
            email: user["email"],
            token: user["token"],
            imageUrl: user["image-url"] ?? "/user.png",
          });

          localStorage.setItem("user", JSON.stringify(this.currentUser()));
        }
      }),
    );
  }

  public logout() {
    this.currentUser.set(null);
    localStorage.removeItem("user");
  }
}
