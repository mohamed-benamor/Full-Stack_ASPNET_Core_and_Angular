import { Component, signal } from "@angular/core";

@Component({
  imports: [],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
})
export class Nav {
  protected title = signal("Logo");
}
