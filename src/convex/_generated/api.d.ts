/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as assessments from "../assessments.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as crisis from "../crisis.js";
import type * as http from "../http.js";
import type * as journal from "../journal.js";
import type * as mood from "../mood.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as sessions from "../sessions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assessments: typeof assessments;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  contacts: typeof contacts;
  crisis: typeof crisis;
  http: typeof http;
  journal: typeof journal;
  mood: typeof mood;
  resources: typeof resources;
  seed: typeof seed;
  sessions: typeof sessions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
