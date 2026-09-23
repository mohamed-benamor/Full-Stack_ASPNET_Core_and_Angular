import { Component, signal } from "@angular/core";

@Component({
  imports: [],
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class Home {
  protected registerMode = signal(false);

  protected showRegister() {
    this.registerMode.set(true);
  }
}
