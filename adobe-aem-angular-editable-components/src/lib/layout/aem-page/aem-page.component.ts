import { Component } from '@angular/core';
import { AEMContainerComponent } from '../aem-container/aem-container.component';
import { AEMComponentDirective } from '../../directives/aem-component.directive';
import { AEMModelProviderComponent } from '../aem-model-provider/aem-model-provider.component';
import { UtilsService } from '../utils.service';

/**
 * @private
 */
const PAGE_MODEL_SEPARATOR = '/jcr:content/';

@Component({
  selector: 'aem-page',
  host: {
      '[class]': 'hostClasses',
      '[attr.data-cq-data-path]': 'cqPath'
  },
  templateUrl: '../aem-container/aem-container.component.html',
  standalone: true,
  providers: [UtilsService],
  imports: [AEMModelProviderComponent, AEMComponentDirective, AEMContainerComponent]
})
/**
 * The current component carries the base presentational logic of page component
 */
export class AEMPageComponent extends AEMContainerComponent {
  /**
   * Returns the aggregated path of this container path and the provided path
   *
   * @param path - the provided path to aggregate with the container path
   */
  override getDataPath(path: string): string {
    return this.cqPath ? this.cqPath + PAGE_MODEL_SEPARATOR + path : path;
  }
}