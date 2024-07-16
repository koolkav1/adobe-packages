import { Component, Input, Output, ViewChild, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, inject, Signal, signal } from '@angular/core';
import {ModelManagerService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/services/model-manager.service';
import { PathUtilsService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/utils/path.service';
import { Constants } from '../constants';

import { UtilsService } from '../utils.service';
import { AEMComponentDirective } from '../../directives/aem-component.directive';


@Component({
  selector: 'aem-model-provider,[aemModelProvider]',
  templateUrl: './aem-model-provider.component.html',
  standalone: true,
  providers: [ModelManagerService, PathUtilsService, UtilsService]
})
/**
 * The current component is responsible for providing access to the ModelManager and the model of a component
 */
export class AEMModelProviderComponent implements OnInit, OnDestroy {
  /**
   * Path to the model associated with the current instance of the component
   */
  @Input() cqPath: string ='';
  /**
   * Model item associated with the current model provider component
   */
  @Input() cqItem?: any;
  /**
   * Name of the item associated with the current model provider component
   */
  @Input() itemName: string ='';

  @Input() aemModelProvider!: any;
  @Input() pagePath: string = '';
  @Input() itemPath: string = '';

  @Output() updateDataPath = new EventEmitter<{ cqPath: string }>();

  @ViewChild(AEMComponentDirective) aemComponent!: AEMComponentDirective;

  cqItemLoaded: Signal<boolean> = signal(false);

  private changeDetectorRef = inject(ChangeDetectorRef);
  private modelManager = inject(ModelManagerService);
  private pathService = inject(PathUtilsService);
  private utils = inject(UtilsService);
  /**
   * Updates the item data
   */
  private updateItem(): void {
    this.modelManager.getData({ path: this.cqPath }).then(model => {
      this.cqItemLoaded = signal(true);
      this.cqItem = model;

      if (this.pagePath && this.utils.isInEditor()) {
        this.pathService.dispatchGlobalCustomEvent(Constants.ASYNC_CONTENT_LOADED_EVENT, {});
      }

      if (this.aemComponent) {
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.modelManager.initialize();

    if (!this.cqItem && this.pagePath) {
      this.cqPath = this.utils.getCQPath(this.pagePath, this.itemPath);
      this.updateDataPath.emit({ cqPath: this.cqPath });
      this.updateItem();
    } else {
      this.cqItemLoaded = signal(true);
    }

    this.modelManager.addListener(this.cqPath, this.updateItem.bind(this));
  }

  ngOnDestroy(): void {
    this.modelManager.removeListener(this.cqPath, this.updateItem.bind(this));
  }
}
