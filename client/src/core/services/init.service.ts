import { inject, Service } from "@angular/core";
import { AccountService } from "./account.service";
import { of } from "rxjs";

@Service()
export class InitService {
  private service = inject(AccountService);

  public init() {
    const userString = localStorage.getItem("user");

    if (!userString) {
      return of(null);
    }

    const user = JSON.parse(userString);

    this.service.currentUser.set(user);

    return of(null);
  }
}
