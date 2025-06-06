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
import type * as header from "../header.js";
import type * as introduction from "../introduction.js";
import type * as projectdetails from "../projectdetails.js";
import type * as projects from "../projects.js";
import type * as services from "../services.js";
import type * as skills from "../skills.js";
import type * as technologies from "../technologies.js";
import type * as workExperience from "../workExperience.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  header: typeof header;
  introduction: typeof introduction;
  projectdetails: typeof projectdetails;
  projects: typeof projects;
  services: typeof services;
  skills: typeof skills;
  technologies: typeof technologies;
  workExperience: typeof workExperience;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
