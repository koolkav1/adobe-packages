import { MappedComponentProperties } from "./mapped-component-properties.interface";
import {ComponentMappingWithConfigService} from '../layout/component-mapping-with-config.service';
import { Model } from "@kav-khalsa/adobe-aem-spa-model-manager/src/lib/common/model.interface";
import { CQItems } from "./cq-items.interface";
/**
 * Properties corresponding to the AEMContainerComponent
 */
export interface AEMContainerComponentProperties extends MappedComponentProperties {
    componentMapping?: typeof ComponentMappingWithConfigService;
    /**
     * Map of model items included in the current container
     */
    cqItems?: CQItems;
    /**
     * Array of model item keys
     */
    cqItemsOrder?: string[];
    /**
     * Class names of the current component
     */
    classNames: string;
  }