import { TestBed } from '@angular/core/testing';
import { SPAComponentMappingService } from './spa-component-mapping.service';
import { LazyMapTo } from './lazy-map-to.function';
import { lazyMapFunction } from '../models/lazy-map-function.type';

describe('LazyMapTo Function', () => {
  let service: SPAComponentMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SPAComponentMappingService]
    });
    service = TestBed.inject(SPAComponentMappingService);
    SPAComponentMappingService.instance = service;
  });

  it('should lazy map a resource type to a class', async () => {
    const lazyFunction: lazyMapFunction = () => Promise.resolve('LazyComponent');
    LazyMapTo('lazy/resource/type')(lazyFunction);
    const result = await service.getLazy('lazy/resource/type');
    expect(result).toBe('LazyComponent');
  });

  it('should reject if lazy resource type is not found', async () => {
    try {
      await service.getLazy('nonexistent/resource/type');
    } catch (error) {
      expect(error).toBe('ResourceType nonexistent/resource/type not found in lazy mappings.');
    }
  });
});
