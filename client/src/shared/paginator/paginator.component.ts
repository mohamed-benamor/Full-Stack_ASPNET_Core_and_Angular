import { Component, computed, input, model, output } from "@angular/core";

@Component({
  imports: [],
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
})
export class Paginator {
  protected readonly pageChange = output<{ pageNumber: number; pageSize: number }>();

  public readonly pageNumber = model(1);
  public readonly pageSize = model(10);
  public readonly totalCount = input(0);
  public readonly totalPages = input(0);
  public readonly pageSizeOptions = input([5, 10, 20, 50]);

  protected lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  });

  protected onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) {
      this.pageNumber.set(newPage);
    }
    if (pageSize) {
      const size = Number((pageSize as HTMLSelectElement).value);
      this.pageSize.set(size);
    }

    this.pageChange.emit({ pageNumber: this.pageNumber(), pageSize: this.pageSize() });
  }
}
