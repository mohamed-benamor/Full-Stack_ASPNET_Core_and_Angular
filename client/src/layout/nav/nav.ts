import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  imports: [FormsModule],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
})
export class Nav {
  protected title = signal("Logo");
  protected credentials = {
    email: "",
    password: "",
  };

  public login() {
    console.log(this.credentials);
  }
}
