import { AEMAllowedComponentsContainerComponentProperties } from "./aem-allowed-components-container-component-properties.interface";

export interface AEMResponsiveGridComponentProperties extends AEMAllowedComponentsContainerComponentProperties {
    /**
     * Class names associated with the current responsive grid
     */
    gridClassNames?: string;
    /**
     * Map of class names corresponding to each child of the current responsive grid
     */
    columnClassNames?: { [key: string]: string };
  
    /**
     * Current number of columns of the grid
     */
    columnCount?: number;
  }