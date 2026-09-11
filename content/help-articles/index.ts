import { combiVsSystemArticle } from './combi-vs-system-boiler';
import { newBoilerCostArticle } from './new-boiler-cost';
import { smartThermostatsArticle } from './smart-thermostats';

export type HelpArticleDraft = {
  slug: string;
  title: string;
  excerpt: string;
  body: unknown[];
};

/**
 * All drafted long-form Help & Advice articles (RGW-017, plus RGW-056's
 * smart-thermostats draft), in one place so both the import script and the
 * render/word-count tests iterate the same list. Add new drafts here as
 * they're written.
 */
export const helpArticleDrafts: HelpArticleDraft[] = [
  newBoilerCostArticle,
  combiVsSystemArticle,
  smartThermostatsArticle,
];

export { combiVsSystemArticle, newBoilerCostArticle, smartThermostatsArticle };
