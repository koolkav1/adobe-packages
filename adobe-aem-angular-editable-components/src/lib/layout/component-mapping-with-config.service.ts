import { Injectable, Inject, Type } from '@angular/core';
import { MappedComponentProperties } from '../models/mapped-component-properties.interface';
import { EditConfig } from '../models/edit-config.interface';
import { lazyMapFunction } from '../models/lazy-map-function.type';
import { SPAComponentMappingService } from '../misc/spa-component-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class ComponentMappingWithConfigService {
  private editConfigMap: { [key: string]: EditConfig<MappedComponentProperties> } = {};

  constructor(private spaMapping: SPAComponentMappingService) {}

  map<Model extends MappedComponentProperties = any>(
    resourceTypes: string | string[],
    clazz: Type<Model>,
    editConfig?: EditConfig<Model>
  ): void {
    const resourceList = Array.isArray(resourceTypes) ? resourceTypes : [resourceTypes];

    resourceList.forEach((entry) => {
      if (editConfig) {
        this.editConfigMap[entry] = editConfig;
      }
      this.spaMapping.map(entry, clazz);
    });
  }

  lazyMap<Model extends MappedComponentProperties = any>(
    resourceTypes: string | string[],
    lazyClassFunction: lazyMapFunction,
    editConfig?: EditConfig<Model>
  ): void {
    const resourceList = Array.isArray(resourceTypes) ? resourceTypes : [resourceTypes];

    resourceList.forEach((entry) => {
      if (editConfig) {
        this.editConfigMap[entry] = editConfig;
      }
      this.spaMapping.lazyMap(entry, lazyClassFunction);
    });
  }

  get<Model extends MappedComponentProperties = any>(resourceType: string): Type<Model> {
    return this.spaMapping.get(resourceType) as Type<Model>;
  }

  getLazy<Model extends MappedComponentProperties = any>(resourceType: string): Promise<Type<Model>> {
    return this.spaMapping.getLazy(resourceType) as Promise<Type<Model>>;
  }

  getEditConfig<Model extends MappedComponentProperties = any>(resourceType: string): EditConfig<Model> {
    return this.editConfigMap[resourceType];
  }
}
