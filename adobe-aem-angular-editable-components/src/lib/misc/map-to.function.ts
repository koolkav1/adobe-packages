import { SPAComponentMappingService } from './spa-component-mapping.service';

export const MapTo = (resourceTypes: string | string[]): ((clazz: unknown) => void) => {
  return (clazz: unknown) => {
    const service = SPAComponentMappingService.instance;
    if (service) {
      service.map(resourceTypes, clazz);
    }
  };
};
