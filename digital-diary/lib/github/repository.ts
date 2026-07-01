import "server-only";
import { loadManifest } from "./manifest";
import { loadMetaIndex } from "./index";
import { loadPage } from "./page";

export const RepositoryService = {
  getManifest: loadManifest,
  getPagesIndex: loadMetaIndex,
  getPageBySlug: loadPage,
};
