import { Directive, Input } from "@angular/core";
import { MappedComponentProperties } from "../models/mapped-component-properties.interface";

@Directive()
export abstract class AbstractMappedComponentDirective implements MappedComponentProperties {
  @Input() isInEditor = false;
  @Input() cqPath = '';
  @Input() itemName = '';
}