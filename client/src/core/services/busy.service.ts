import { Service, signal } from "@angular/core";

@Service()
export class BusyService {
  public readonly busyRequestCount = signal(0);

  public busy() {
    this.busyRequestCount.update(current => current + 1);
  }

  public idle() {
    this.busyRequestCount.update(current => Math.max(0, current - 1));
  }
}
