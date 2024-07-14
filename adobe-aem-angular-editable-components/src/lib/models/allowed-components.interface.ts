import { AllowedComponent } from "./allowed-component.interface";

/**
 * AllowedComponents collection
 */
export interface AllowedComponents {
    applicable: boolean;
  
    /**
     * List of allowed components
     */
    components: AllowedComponent[];
  }