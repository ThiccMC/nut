import { edenTreaty } from "@elysiajs/eden/treaty";
import type { App } from ".";

export default (url: string) => edenTreaty<App>(url);
