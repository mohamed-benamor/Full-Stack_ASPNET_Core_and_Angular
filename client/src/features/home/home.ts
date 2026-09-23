import { Component, input, signal } from "@angular/core";
import { Register } from "../account/register/register";
import { Member } from "../../types";

@Component({
  imports: [Register],
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class Home {
  protected registerMode = signal(false);

  public members = input.required<Member[]>();

  protected showRegister() {
    this.registerMode.set(true);
  }
}
