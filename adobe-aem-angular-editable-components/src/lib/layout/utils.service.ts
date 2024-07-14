import { Injectable } from '@angular/core';

/**
 * Selector that identifies the node that contains the WCM mode state.
 * @private
 */
const WCM_MODE_META_SELECTOR = 'meta[property="cq:wcmmode"]';

/**
 * The editor is in one of the edition modes.
 * @private
 */
const EDIT_MODE = 'edit';

/**
 * The editor is in preview mode.
 * @private
 */
const PREVIEW_MODE = 'preview';

/**
 * Returns if we are in the browser context or not by checking for the
 * existence of the window object.
 * @private
 */
function isBrowser(): boolean {
  try {
    return typeof window !== 'undefined';
  } catch (e) {
    return false;
  }
}

/**
 * Returns the current WCM mode
 *
 * <p>Note that the value isn't, as of the date of this writing, updated by the editor</p>
 * @private
 */
function getWCMMode(): string | undefined {
  if (isBrowser()) {
    const wcmModeMeta = document.head.querySelector(WCM_MODE_META_SELECTOR) as HTMLMetaElement | null;
    return wcmModeMeta?.content;
  }
  return undefined;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  /**
   * Is the app used in the context of the AEM Page editor.
   */
  isInEditor(): boolean {
    const wcmMode = getWCMMode();
    return wcmMode === EDIT_MODE || wcmMode === PREVIEW_MODE;
  }

  /**
   * Determines the cqPath of a component given its props
   * @returns cqPath of the component
   */
  getCQPath(pagePath: string, itemPath?: string): string {
    let path = itemPath ? `${pagePath}/jcr:content/${itemPath}` : pagePath;
    path = path.replace(/\/+/g, '/');
    return path;
  }
}
