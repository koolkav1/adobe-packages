import { SPAComponentMappingService } from './spa-component-mapping.service';
import { lazyMapFunction } from '../models/lazy-map-function.type';

export const LazyMapTo = (resourceTypes: string | string[]): ((lazyPromise: lazyMapFunction) => void) => {
  return (lazyPromise: lazyMapFunction) => {
    const service = SPAComponentMappingService.instance;
    if (service) {
      service.lazyMap(resourceTypes, lazyPromise);
    }
  };
};
