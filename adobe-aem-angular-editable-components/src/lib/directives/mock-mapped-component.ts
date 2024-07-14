import { Component } from '@angular/core';
import { MappedComponentProperties } from '../models/mapped-component-properties.interface';

@Component({
  selector: 'mock-mapped-component',
  template: '<div>Mock Mapped Component</div>'
})
export class MockMappedComponent implements MappedComponentProperties {
  cqPath: string = '';
  itemName: string = '';
  testProp?: string;
}
