import { Injectable, Type } from '@angular/core';
import { MappedComponentProperties } from '../../models/mapped-component-properties.interface';
import { EditConfig } from '../../models/edit-config.interface';
import { lazyMapFunction } from '../../models/lazy-map-function.type';
import { ComponentMappingWithConfigService } from '../component-mapping-with-config.service';

@Injectable({
  providedIn: 'root',
})
export class LazyMapToService {
  constructor(private componentMappingWithConfigService: ComponentMappingWithConfigService) {}

  public lazyMapTo<Model extends MappedComponentProperties = any>(resourceTypes: string | string[]) {
    return (lazyClassFunction: lazyMapFunction, editConfig?: EditConfig<Model>): void => {
      this.componentMappingWithConfigService.lazyMap(resourceTypes, lazyClassFunction, editConfig);
    };
  }
}
