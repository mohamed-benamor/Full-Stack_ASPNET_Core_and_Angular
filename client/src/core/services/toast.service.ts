import { Service } from "@angular/core";

@Service()
export class ToastService {
  public constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast toast-bottom toast-end";
      document.body.appendChild(container);
    }
  }

  private createToastElement(
    message: string,
    alertClass: "alert-success" | "alert-info" | "alert-warning" | "alert-error",
    duration = 5000,
  ) {
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
      return;
    }

    const toast = document.createElement("div");
    toast.classList.add("alert", alertClass, "shadow-lg", "flex", "justify-between");
    toast.innerHTML = `
    <span class="w-fit max-w-50 wrap-normal">${message}</span>
    <button class="ml-4 btn btn-sm btn-ghost">X</button>
    `;

    toast.querySelector("button")?.addEventListener("click", () => {
      toastContainer.removeChild(toast);
    });

    toastContainer.append(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }

  public success(message: string, duration?: number) {
    this.createToastElement(message, "alert-success", duration);
  }

  public info(message: string, duration?: number) {
    this.createToastElement(message, "alert-info", duration);
  }

  public warning(message: string, duration?: number) {
    this.createToastElement(message, "alert-warning", duration);
  }

  public error(message: string, duration?: number) {
    this.createToastElement(message, "alert-error", duration);
  }
}
