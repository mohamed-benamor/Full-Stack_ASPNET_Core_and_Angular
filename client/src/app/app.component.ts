import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { Nav } from "../layout/nav/nav.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [Nav, RouterOutlet],
})
export class App {
  protected router = inject(Router);
}
