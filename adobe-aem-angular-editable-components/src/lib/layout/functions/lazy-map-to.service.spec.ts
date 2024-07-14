import { TestBed } from '@angular/core/testing';
import { ComponentMappingWithConfigService } from '../component-mapping-with-config.service';
import { LazyMapToService } from './lazy-map-to.service';
import { Type } from '@angular/core';
import { lazyMapFunction } from '../../models/lazy-map-function.type';

describe('LazyMapToService', () => {
  let lazyMapToService: LazyMapToService;
  let componentMappingWithConfigService: ComponentMappingWithConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentMappingWithConfigService, LazyMapToService],
    });
    lazyMapToService = TestBed.inject(LazyMapToService);
    componentMappingWithConfigService = TestBed.inject(ComponentMappingWithConfigService);
  });

  it('should lazy map a resource type to a class', async () => {
    const lazyFunction: lazyMapFunction = () => Promise.resolve('LazyComponent' as unknown as Type<any>);
    lazyMapToService.lazyMapTo('lazy/resource/type')(lazyFunction);
    const result = await componentMappingWithConfigService.getLazy('lazy/resource/type');
    expect(result).toBe('LazyComponent' as unknown as Type<any>);
  });

  it('should reject if lazy resource type is not found', async () => {
    try {
      await componentMappingWithConfigService.getLazy('nonexistent/resource/type');
    } catch (error) {
      expect(error).toBe('ResourceType nonexistent/resource/type not found in lazy mappings.');
    }
  });
});
