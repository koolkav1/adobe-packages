import { Component, Input } from '@angular/core';
import { AllowedComponents } from '../../models/allowed-components.interface';
import { AEMContainerComponentProperties } from '../../models/aem-container-component-properties.interface';
import { AEMContainerComponent } from '../aem-container/aem-container.component';
import { AllowedComponent } from '../../models/allowed-component.interface';
import {
  ALLOWED_PLACEHOLDER_CLASS_NAMES,
  ALLOWED_COMPONENT_TITLE_CLASS_NAMES,
  ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES,
} from './aem-allowed-components.const';
import { AEMAllowedComponentsContainerComponentProperties } from '../../models/aem-allowed-components-container-component-properties.interface';

@Component({
  selector: 'aem-allowed-components-container',
  templateUrl: './aem-allowed-components-container.component.html',
  standalone: true,
})
export class AEMAllowedComponentsContainerComponent
  extends AEMContainerComponent
  implements AEMAllowedComponentsContainerComponentProperties
{
  @Input() title!: string;

  @Input() emptyLabel = 'No allowed components';

  @Input() allowedComponents!: {
    applicable: boolean;
    components: any;
  };

  isAllowedComponentsApplicable(): boolean {
    return (
      this.isInEditMode &&
      this.allowedComponents &&
      this.allowedComponents.applicable
    );
  }

  getAllowedComponentListPlaceholderClassNames(): string {
    return (
      super.getPlaceholderClassNames() + ' ' + ALLOWED_PLACEHOLDER_CLASS_NAMES
    );
  }

  getAllowedComponentListLabel(): string {
    const hasComponents =
      this.allowedComponents &&
      this.allowedComponents.components &&
      this.allowedComponents.components.length > 0;

    return hasComponents ? this.title : this.emptyLabel;
  }

  getAllowedComponents(): AllowedComponent[] {
    return (this.allowedComponents && this.allowedComponents.components) || [];
  }

  get allowedComponentListTitleClassNames(): string {
    return ALLOWED_COMPONENT_TITLE_CLASS_NAMES;
  }

  get allowedComponentClassNames(): string {
    return ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES;
  }
}
