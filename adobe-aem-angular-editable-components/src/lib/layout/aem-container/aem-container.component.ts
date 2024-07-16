import { Component, Input, inject } from '@angular/core';
import { AEMContainerComponentProperties } from '../../models/aem-container-component-properties.interface';
import { Model } from '../../../mocks/model';
import { CONTAINER_CLASS_NAMES, PLACEHOLDER_CLASS_NAMES, PLACEHOLDER_ITEM_NAME } from './aem-container.const';
import { AbstractMappedComponentDirective } from '../../directives/abstract-mapped-component.directive';
import { UtilsService } from '../utils.service';
import { CQItems } from '../../models/cq-items.interface';

@Component({
  selector: 'aem-container',
  host: {
    '[class]': 'hostClasses',
    '[attr.data-cq-data-path]': 'cqPath'
  },
  standalone: true,
  template: '<ng-content></ng-content>' // Ensure there's content to render
})
export class AEMContainerComponent extends AbstractMappedComponentDirective implements AEMContainerComponentProperties {
  @Input() cqItems?: CQItems;
  @Input() cqItemsOrder?: string[];
  @Input() classNames = '';
  @Input() modelName = '';
  @Input() override cqPath = '';

  private utils = inject(UtilsService);

  get isInEditMode(): boolean {
    return this.utils.isInEditor();
  }

  getDataPath(path: string): string {
    return this.cqPath ? this.cqPath + '/' + path : path;
  }

  getItem(itemKey: string): Model | undefined {
    return this.cqItems?.[itemKey];
  }

  getHostClassNames(): string {
    return CONTAINER_CLASS_NAMES;
  }

  get hostClasses(): string {
    return this.getHostClassNames();
  }

  getPlaceholderClassNames(): string {
    return PLACEHOLDER_CLASS_NAMES;
  }

  get placeholderPath(): string {
    return this.cqPath && this.cqPath + '/' + PLACEHOLDER_ITEM_NAME;
  }
}
