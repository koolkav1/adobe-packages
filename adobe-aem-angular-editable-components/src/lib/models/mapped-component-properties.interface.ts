import { ReloadForceAble } from "./reload-force-able.interface";

/**
* MappedComponentProperties
* Properties given to every component runtime by the SPA editor.
*/
export interface MappedComponentProperties extends ReloadForceAble {
    /**
     * Path to the model associated with the current instance of the component
     */
  cqPath: string;

    /**
     * Angular item name
     */
  itemName: string;
}