import { Component, Input } from '@angular/core';
import { AbstractMappedComponentDirective } from '../lib/directives/abstract-mapped-component.directive';
import { MappedComponentProperties } from '../lib/models/mapped-component-properties.interface';


export interface LazyComponentType extends MappedComponentProperties {
    otherValue: string;
}

@Component({
    selector: 'lazy-comp',
    template: `<div>{{ otherValue }}</div>`
})
/**
 * The current class carries the base presentational logic of the AEM Layout Container (aka. Responsive grid)
 */
export class LazyComponent extends AbstractMappedComponentDirective implements LazyComponentType {
    @Input() otherValue;
}