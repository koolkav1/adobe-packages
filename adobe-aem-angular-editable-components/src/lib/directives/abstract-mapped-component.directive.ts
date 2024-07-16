import { Directive, Input, isStandalone } from "@angular/core";
import { MappedComponentProperties } from "../models/mapped-component-properties.interface";

@Directive(
{
  standalone: true,
})
export abstract class AbstractMappedComponentDirective implements MappedComponentProperties {
  @Input() isInEditor = false;
  @Input() cqPath = '';
  @Input() itemName = '';
}