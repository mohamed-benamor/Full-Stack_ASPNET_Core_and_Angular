import { Component, input, output } from "@angular/core";

@Component({
  imports: [],
  selector: "app-star-button",
  templateUrl: "./star-button.component.html",
})
export class StarButton {
  protected readonly clickEvent = output<Event>();

  public readonly disabled = input<boolean>();
  public readonly selected = input<boolean>();

  protected onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
