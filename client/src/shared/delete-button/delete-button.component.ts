import { Component, input, output } from "@angular/core";

@Component({
  imports: [],
  selector: "app-delete-button",
  templateUrl: "./delete-button.component.html",
})
export class DeleteButton {
  protected readonly clickEvent = output<Event>();

  public readonly disabled = input<boolean>();

  protected onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
