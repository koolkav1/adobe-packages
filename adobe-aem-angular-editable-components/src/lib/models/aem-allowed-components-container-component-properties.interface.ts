import { AEMContainerComponentProperties } from "./aem-container-component-properties.interface";
import { AllowedComponents } from "./allowed-components.interface";

export interface AEMAllowedComponentsContainerComponentProperties extends AEMContainerComponentProperties {

    allowedComponents: AllowedComponents;
  
    _allowedComponentPlaceholderListEmptyLabel?: string;
  
    title: string;
  }