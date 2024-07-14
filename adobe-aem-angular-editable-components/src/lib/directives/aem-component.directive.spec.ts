import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMComponentDirective, PLACEHOLDER_CLASS_NAME } from './aem-component.directive';
import { Component, Input, ViewChild, Type } from '@angular/core';
import { ViewContainerRef, ChangeDetectorRef, ComponentRef, Injector } from '@angular/core';
import { Constants } from '../layout/constants';
import { UtilsService } from '../layout/utils.service';
import { ComponentMappingWithConfigService } from '../layout/component-mapping-with-config.service';
import { MappedComponentProperties } from '../models/mapped-component-properties.interface';

@Component({
  selector: 'test-component',
  template: `<div aemComponent [cqItem]='data'></div>`
})
class AEMDirectiveTestComponent {
  @Input() data: any;
}

@Component({
  selector: 'directive-component',
  host: {
      '[attr.attr1]': 'attr1',
      '[attr.attr2]': 'attr2'
  },
  template: `<div></div>`
})
class DirectiveComponent implements MappedComponentProperties {
  @Input() attr1: any;
  @Input() attr2: any;
  cqPath = '';
  itemName = '';
}

describe('AEMComponentDirective', () => {

  const EDIT_CONFIG_EMPTY_LABEL = 'Edit config empty label';

  const TEST_EDIT_CONFIG_EMPTY = {
    emptyLabel: EDIT_CONFIG_EMPTY_LABEL,
    isEmpty: () => true
  };

  const TEST_EDIT_CONFIG_NOT_EMPTY = {
    emptyLabel: EDIT_CONFIG_EMPTY_LABEL,
    isEmpty: () => false
  };

  let component: AEMDirectiveTestComponent;
  let fixture: ComponentFixture<AEMDirectiveTestComponent>;
  let directive: AEMComponentDirective;
  let viewContainerRef: ViewContainerRef;
  let changeDetectorRef: ChangeDetectorRef;
  let utilsService: UtilsService;
  let componentMappingService: ComponentMappingWithConfigService;

  beforeEach((() => {
    utilsService = {
      isInEditor: jest.fn().mockReturnValue(false)
    } as unknown as UtilsService;

    componentMappingService = {
      get: jest.fn(),
      getLazy: jest.fn(),
      getEditConfig: jest.fn()
    } as unknown as ComponentMappingWithConfigService;

    TestBed.configureTestingModule({
      declarations: [ AEMDirectiveTestComponent, DirectiveComponent, AEMComponentDirective ],
      providers: [
        { provide: ViewContainerRef, useValue: { clear: jest.fn(), createComponent: jest.fn() } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
        { provide: UtilsService, useValue: utilsService },
        { provide: ComponentMappingWithConfigService, useValue: componentMappingService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AEMDirectiveTestComponent);
    component = fixture.componentInstance;
    viewContainerRef = TestBed.inject(ViewContainerRef);
    changeDetectorRef = TestBed.inject(ChangeDetectorRef);
    directive = new AEMComponentDirective(viewContainerRef, changeDetectorRef, utilsService, componentMappingService, TestBed.inject(Injector));
  });

  it('should correctly pass the inputs', () => {
    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp',
      appliedCssClassNames: 'applied-css-class1'
    };

    component.data = componentData;
    directive.ngOnChanges();
    fixture.detectChanges();
   

    const element = fixture.nativeElement.querySelector('directive-component');
    console.log('el: ', element);
    console.log(fixture.nativeElement);
    expect(element.getAttribute('attr1')).toEqual(componentData.attr1);
    expect(element.getAttribute('attr2')).toEqual(componentData.attr2);
    expect(element.getAttribute('class')).toEqual(componentData.appliedCssClassNames);
  });

  it('should not resolve if incoming type is non existing', () => {
    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/unknown-comp',
      appliedCssClassNames: 'applied-css-class1'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('directive-component');

    expect(element).toBeNull();
  });

  it('should correctly pass the inputs for lazy component', async () => {
    const componentData = {
      some: 'Some value',
      ':type': 'some/lazy/comp'
    };

    component.data = componentData;
    jest.spyOn(componentMappingService, 'getLazy').mockResolvedValue(DirectiveComponent);

    await import('../../mocks/lazy.component');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('directive-component');
    expect(element).not.toBeNull();
  });

  it('should setup the placeholder', () => {
    jest.spyOn(utilsService, 'isInEditor').mockReturnValue(true);
    jest.spyOn(componentMappingService, 'getEditConfig').mockReturnValue(TEST_EDIT_CONFIG_EMPTY);

    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('directive-component');

    expect(element.dataset.emptytext).toEqual(TEST_EDIT_CONFIG_EMPTY.emptyLabel);
  });

  it('should NOT setup the placeholder', () => {
    jest.spyOn(utilsService, 'isInEditor').mockReturnValue(true);
    jest.spyOn(componentMappingService, 'getEditConfig').mockReturnValue(TEST_EDIT_CONFIG_NOT_EMPTY);

    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('directive-component');

    expect(element.dataset.emptytext).toBeUndefined();
  });

  it('should correctly update the inputs', () => {
    const componentData1 = {
      attr2: 'Initial value',
      ':type': 'directive/comp'
    };

    const componentData2 = {
      attr1: 'New value',
      attr2: 'Updated value',
      ':type': 'directive/comp'
    };

    component.data = componentData1;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('directive-component');

    expect(element.getAttribute('attr1')).toBeNull();
    expect(element.getAttribute('attr2')).toEqual(componentData1.attr2);

    component.data = componentData2;
    fixture.detectChanges();

    expect(element.getAttribute('attr1')).toEqual(componentData2.attr1);
    expect(element.getAttribute('attr2')).toEqual(componentData2.attr2);
  });
});
