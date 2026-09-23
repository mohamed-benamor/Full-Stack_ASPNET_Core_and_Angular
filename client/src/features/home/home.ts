import { Component, signal } from "@angular/core";
import { Register } from "../account/register/register";

@Component({
  imports: [Register],
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class Home {
  protected registerMode = signal(false);

  protected showRegister() {
    this.registerMode.set(true);
  }
}
