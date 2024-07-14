import { TestBed } from '@angular/core/testing';
import { ComponentMappingWithConfigService } from '../component-mapping-with-config.service';
import { MapToService } from './map-to.service';
import { MappedComponentProperties } from '../../models/mapped-component-properties.interface';
import { Type } from '@angular/core';

describe('MapToService', () => {
  let mapToService: MapToService;
  let componentMappingWithConfigService: ComponentMappingWithConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentMappingWithConfigService, MapToService],
    });
    mapToService = TestBed.inject(MapToService);
    componentMappingWithConfigService = TestBed.inject(ComponentMappingWithConfigService);
  });

  it('should map a resource type to a class', () => {
    class TestComponent implements MappedComponentProperties {
      cqPath = '';
      itemName = '';
    }
    mapToService.mapTo('test/resource/type')(TestComponent as Type<any>);
    const result = componentMappingWithConfigService.get('test/resource/type');
    expect(result).toBe(TestComponent);
  });

  it('should map multiple resource types to a class', () => {
    class TestComponent implements MappedComponentProperties {
      cqPath = '';
      itemName = '';
    }
    const resourceTypes = ['test/resource/type1', 'test/resource/type2'];
    mapToService.mapTo(resourceTypes)(TestComponent as Type<any>);
    const result1 = componentMappingWithConfigService.get('test/resource/type1');
    const result2 = componentMappingWithConfigService.get('test/resource/type2');
    expect(result1).toBe(TestComponent);
    expect(result2).toBe(TestComponent);
  });
});
