import { Injectable } from '@angular/core';
import { ComponentMappingObject } from '../models/component-mapping-object.interface';
import { LazyComponentMappingObject } from '../models/lazy-component-mapping-object.interface';
import { lazyMapFunction } from '../models/lazy-map-function.type';

@Injectable({
  providedIn: 'root'
})
export class SPAComponentMappingService {
  public static instance: SPAComponentMappingService;
  private mapping: ComponentMappingObject = {};
  private lazyMapping: LazyComponentMappingObject = {};

  constructor() {
    if (!SPAComponentMappingService.instance) {
      SPAComponentMappingService.instance = this;
    }
  }

  public map(resourceTypes: string | string[], clazz: unknown): void {
    if (resourceTypes && clazz) {
      const resourceList = Array.isArray(resourceTypes) ? resourceTypes : [resourceTypes];
      resourceList.forEach((entry) => {
        this.mapping[entry] = clazz;
      });
    } else {
      console.warn('Invalid resourceTypes or class provided for mapping.');
    }
  }

  public lazyMap(resourceTypes: string | string[], clazz: lazyMapFunction): void {
    if (resourceTypes && clazz) {
      const resourceList = Array.isArray(resourceTypes) ? resourceTypes : [resourceTypes];
      resourceList.forEach((entry) => {
        this.lazyMapping[entry] = clazz;
      });
    } else {
      console.warn('Invalid resourceTypes or lazyMapFunction provided for lazy mapping.');
    }
  }

  public get<T>(resourceType: string): T | undefined {
    return this.mapping[resourceType] as T;
  }

  public getLazy<T>(resourceType: string): Promise<T> {
    const lazyFunc = this.lazyMapping[resourceType];
    if (lazyFunc) {
      return lazyFunc() as Promise<T>;
    }
    return Promise.reject(`ResourceType ${resourceType} not found in lazy mappings.`);
  }
}
