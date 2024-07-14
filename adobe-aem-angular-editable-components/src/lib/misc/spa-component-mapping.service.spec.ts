import { TestBed } from '@angular/core/testing';
import { SPAComponentMappingService } from './spa-component-mapping.service';
import { MapTo } from './map-to.function';

describe('MapTo Function', () => {
  let service: SPAComponentMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SPAComponentMappingService]
    });
    service = TestBed.inject(SPAComponentMappingService);
    SPAComponentMappingService.instance = service;
  });

  it('should map a resource type to a class', () => {
    class TestComponent {}
    MapTo('test/resource/type')(TestComponent);
    const result = service.get('test/resource/type');
    expect(result).toBe(TestComponent);
  });

  it('should map multiple resource types to a class', () => {
    class TestComponent {}
    const resourceTypes = ['test/resource/type1', 'test/resource/type2'];
    MapTo(resourceTypes)(TestComponent);
    const result1 = service.get('test/resource/type1');
    const result2 = service.get('test/resource/type2');
    expect(result1).toBe(TestComponent);
    expect(result2).toBe(TestComponent);
  });
});
