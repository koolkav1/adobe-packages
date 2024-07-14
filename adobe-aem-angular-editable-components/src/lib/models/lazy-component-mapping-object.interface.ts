import { lazyMapFunction } from "./lazy-map-function.type";

export interface LazyComponentMappingObject {
    [key: string]: lazyMapFunction;
  }