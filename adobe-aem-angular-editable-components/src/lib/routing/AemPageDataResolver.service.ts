import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AemPageDataResolver {

    resolvePath(route: ActivatedRouteSnapshot): string {
      return '/' + route.url.join('/').replace(/\.[^/.]+$/, '');
    }
  }