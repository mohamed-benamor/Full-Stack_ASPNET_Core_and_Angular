import { Component, input, signal } from "@angular/core";
import { Register } from "../account/register/register.component";

@Component({
  imports: [Register],
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class Home {
  protected registerMode = signal(false);

  protected showRegister(value: boolean) {
    this.registerMode.set(value);
  }
}
