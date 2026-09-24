import { Routes } from "@angular/router";
import { Home } from "@features/home/home.component";
import { MemberList } from "@features/members/member-list/member-list.component";
import { MemberDetailed } from "@features/members/member-detailed/member-detailed.component";
import { Lists } from "@features/lists/lists.component";
import { Messages } from "@features/messages/messages.component";
import { authGuard } from "@guards/auth.guard";
import { TestErrors } from "@features/test-errors/test-errors.component";
import { NotFound } from "@shared/errors/not-found/not-found.component";
import { ServerError } from "@shared/errors/server-error/server-error.component";

export const routes: Routes = [
  { path: "", component: Home },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [authGuard],
    children: [
      { path: "members", component: MemberList },
      { path: "members/:id", component: MemberDetailed },
      { path: "lists", component: Lists },
      { path: "messages", component: Messages },
    ],
  },
  { path: "errors", component: TestErrors },
  { path: "server-error", component: ServerError },
  { path: "**", component: NotFound },
];
