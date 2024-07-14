import { Injectable, Type } from '@angular/core';
import { MappedComponentProperties } from '../../models/mapped-component-properties.interface';
import { EditConfig } from '../../models/edit-config.interface';
import { ComponentMappingWithConfigService } from '../component-mapping-with-config.service';

@Injectable({
  providedIn: 'root',
})
export class MapToService {
  constructor(private componentMappingWithConfigService: ComponentMappingWithConfigService) {}

  public mapTo<Model extends MappedComponentProperties = any>(resourceTypes: string | string[]) {
    return (clazz: Type<Model>, editConfig?: EditConfig<Model>): void => {
      this.componentMappingWithConfigService.map(resourceTypes, clazz, editConfig);
    };
  }
}
