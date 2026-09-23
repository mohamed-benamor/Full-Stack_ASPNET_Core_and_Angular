import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";

@Service()
export class AccountService {
  private http = inject(HttpClient);

  private readonly baseUrl = "https://localhost:8000/api";

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/account/login`, credentials);
  }
}
