import { Routes } from "@angular/router";
import { Home } from "../features/home/home.component";
import { MemberList } from "../features/members/member-list/member-list.component";
import { MemberDetailed } from "../features/members/member-detailed/member-detailed.component";
import { Lists } from "../features/lists/lists.component";
import { Messages } from "../features/messages/messages.component";

export const routes: Routes = [
  { path: "", component: Home },
  { path: "members", component: MemberList },
  { path: "members/:id", component: MemberDetailed },
  { path: "lists", component: Lists },
  { path: "messages", component: Messages },
  { path: "**", component: Home },
];
