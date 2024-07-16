import { Component, Input } from '@angular/core';

import { AEMAllowedComponentsContainerComponent } from '../aem-allowed-components-container/aem-allowed-components-container.component';
import { AEMResponsiveGridComponentProperties } from '../../models/aem-responsive-grid-component-properties.interface';
import { Constants } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/common/constants';
import { AEMModelProviderComponent } from '../aem-model-provider/aem-model-provider.component';

const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';
const RESPONSIVE_GRID_TYPE = 'wcm/foundation/components/responsivegrid';

@Component({
  selector: 'aem-responsivegrid',
  host: {
      '[class]': 'hostClasses',
      '[attr.data-cq-data-path]': 'cqPath'
  },
  templateUrl: './aem-responsive-grid.component.html',
  standalone: true,
  imports: [AEMModelProviderComponent]
})
export class AEMResponsiveGridComponent extends AEMAllowedComponentsContainerComponent implements AEMResponsiveGridComponentProperties {

  @Input() gridClassNames = '';
  @Input() columnClassNames: { [x: string]: any; } = {};
  @Input() override classNames = '';
  @Input() columnCount: any;

  getColumnClassNames(itemKey: string): string {
    return this.columnClassNames && this.columnClassNames[itemKey];
  }

  override getPlaceholderClassNames(): string {
    return super.getPlaceholderClassNames() + ' ' + PLACEHOLDER_CLASS_NAMES;
  }

  override getHostClassNames(): string {
    let classNames = super.getHostClassNames();

    if (this.classNames) {
        classNames += ' ' + (this.classNames || '');
    }

    return classNames + ' ' + this.gridClassNames;
  }

  getAttrDataPath(path: string): string | null {
    const item = this.getItem(path);

    if (item && item[Constants.TYPE_PROP] === RESPONSIVE_GRID_TYPE) {
      return null;
    }

    return this.getDataPath(path);
  }
}