

import { Component, Input } from '@angular/core';
import { Constants } from '../constants';
import { AEMAllowedComponentsContainerComponent } from '../aem-allowed-components-container/aem-allowed-components-container.component';
import { AEMResponsiveGridComponentProperties } from '../../models/aem-responsive-grid-component-properties.interface';



@Component({
  selector: 'aem-responsivegrid',
  host: {
      '[class]': 'hostClasses',
      '[attr.data-cq-data-path]': 'cqPath'
  },
  templateUrl: './aem-responsive-grid.component.html'
})
/**
 * The current class carries the base presentational logic of the AEM Layout Container (aka. Responsive grid)
 */
export class AEMResponsiveGridComponent extends AEMAllowedComponentsContainerComponent implements AEMResponsiveGridComponentProperties {

  @Input() gridClassNames: string;
  @Input() columnClassNames: { [x: string]: any; };
  @Input() classNames = '';
  @Input() columnCount: any;

  /**
   * Returns the column class names for a given column
   * @param itemKey - The key of the column item
   */
  getColumnClassNames(itemKey: string): string {
    return this.columnClassNames && this.columnClassNames[itemKey];
  }

  /**
   * Returns the placeholder classes
   */
  getPlaceholderClassNames(): string {
    return super.getPlaceholderClassNames() + ' ' + Constants.PLACEHOLDER_CLASS_NAMES;
  }

  /**
   * Returns the class names of the responsive grid based on the data from the cqModel
   */
  getHostClassNames(): string {
    let classNames = super.getHostClassNames();

    if (this.classNames) {
        classNames += ' ' + (this.classNames || '');
    }

    return classNames + ' ' + this.gridClassNames;
  }

  /**
   * Returns the aggregated path of this container path and the provided path
   *
   * @param path - the provided path to aggregate with the container path
   */
  getAttrDataPath(path: string): string | null {
    const item = this.getItem(path);

    if (item && item[Constants.TYPE_PROP] === Constants.RESPONSIVE_GRID_TYPE) {
      // We don't want to add the path for the wrapper for a reponsivegrid
      // The reponsivegrid adds the path on it's own
      return null;
    }

    return this.getDataPath(path);
  }
}