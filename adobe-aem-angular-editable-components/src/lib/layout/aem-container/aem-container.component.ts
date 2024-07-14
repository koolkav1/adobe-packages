/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Component, Input, inject } from '@angular/core';
import { Constants } from '../constants';


import { AEMContainerComponentProperties } from '../../models/aem-container-component-properties.interface';
import { Model } from '../../../mocks/model';
import { CONTAINER_CLASS_NAMES, PLACEHOLDER_CLASS_NAMES, PLACEHOLDER_ITEM_NAME } from './aem-container.const';
import { ComponentMappingWithConfigService } from '../component-mapping-with-config.service';
import { AbstractMappedComponentDirective } from '../../directives/abstract-mapped-component.directive';
import { UtilsService } from '../utils.service';




@Component({
  selector: 'aem-container',
  host: {
      '[class]': 'hostClasses',
      '[attr.data-cq-data-path]': 'cqPath'
  },
  template:`
  <ng-container *ngFor="let itemKey of cqItemsOrder">
  <aem-model-provider [cqItem]="getItem(itemKey)"
                      [cqPath]="getDataPath(itemKey)"
                      [itemName]="itemKey"></aem-model-provider>
</ng-container>
<div *ngIf="isInEditMode"
     [attr.data-cq-data-path]="placeholderPath"
     [class]="getPlaceholderClassNames()"></div>
  `
})
/**
 * The current component provides the base presentational logic common to containers such as a grid or a page.
 * Container have in common the notion of item holders. Items are represented in the model by the fields _:items_ and _:itemsOrder_
 */
export class AEMContainerComponent extends AbstractMappedComponentDirective implements AEMContainerComponentProperties{




  @Input() cqItems;

  @Input() cqItemsOrder;

  @Input() classNames;
  /**
   * Key of the model structure
   */
  @Input() modelName = '';

  @Input() cqPath = '';
  
  private utils = inject(UtilsService);

  /**
   * Returns weather of not we are in the editor
   */
  get isInEditMode(): boolean {
    return this.utils.isInEditor();
  }

  /**
   * Returns the aggregated path of this container path and the provided path
   *
   * @param path - the provided path to aggregate with the container path
   */
  getDataPath(path: string): string {
    return this.cqPath ? this.cqPath + '/' + path : path;
  }

  /**
   * Returns the item data from the cqModel
   *
   * @param itemKey - the itemKey to look for in the items.
   */
  getItem(itemKey: string): Model {
    return this.cqItems && this.cqItems[itemKey];
  }

  /**
   * Returns the class names of the container based on the data from the cqModel
   */
  getHostClassNames(): string {
    return CONTAINER_CLASS_NAMES;
  }

  get hostClasses(): string {
    return this.getHostClassNames();
  }

  /**
   * Returns the placeholder classes
   */
  getPlaceholderClassNames(): string {
    return PLACEHOLDER_CLASS_NAMES;
  }

  /**
   * Returns the placeholder path
   */
  get placeholderPath(): string {
    return this.cqPath && this.cqPath + '/' + PLACEHOLDER_ITEM_NAME;
  }
}