import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import {AemPageDataResolver} from './AemPageDataResolver.service';

describe('AemPageDataResolver', () => {
  let resolver: AemPageDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = new AemPageDataResolver();
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return the absolute resource path without extension', () => {
    const route = new ActivatedRouteSnapshot();
    route.url = [
      new UrlSegment('content', {}),
      new UrlSegment('aa', {}),
      new UrlSegment('bb.html', {})
    ];
    
    const result = resolver.resolvePath(route);
    expect(result).toBe('/content/aa/bb');
  });

  it('should handle routes with no extension', () => {
    const route = new ActivatedRouteSnapshot();
    route.url = [
      new UrlSegment('content', {}),
      new UrlSegment('aa', {}),
      new UrlSegment('bb', {})
    ];

    const result = resolver.resolvePath(route);
    expect(result).toBe('/content/aa/bb');
  });

  it('should handle routes with multiple extensions', () => {
    const route = new ActivatedRouteSnapshot();
    route.url = [
      new UrlSegment('content', {}),
      new UrlSegment('aa', {}),
      new UrlSegment('bb.tar.gz', {})
    ];

    const result = resolver.resolvePath(route);
    expect(result).toBe('/content/aa/bb.tar');
  });

  it('should handle empty routes', () => {
    const route = new ActivatedRouteSnapshot();
    route.url = [];

    const result = resolver.resolvePath(route);
    expect(result).toBe('/');
  });
});
