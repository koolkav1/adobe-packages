import { Component, Input, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Renderer2, Injector, ChangeDetectorRef, ViewContainerRef, ComponentRef } from '@angular/core';
import { AEMComponentDirective } from './aem-component.directive';
import { Constants } from '../layout/constants';
import { UtilsService } from '../layout/utils.service';
import { ComponentMappingWithConfigService } from '../layout/component-mapping-with-config.service';
import { MappedComponentProperties } from '../models/mapped-component-properties.interface';
import { MockMappedComponent } from './mock-mapped-component';
import { LazyComponentType } from '../test/lazy-component-wrapper/lazy.component';
import { ComponentMapping, MapTo, LazyMapTo, AbstractMappedComponentDirective } from './component-mapping';

@Component({
  selector: 'test-host-component',
  template: `<div aemComponent [cqItem]="data"></div>`
})
class TestHostComponent {
  @ViewChild(AEMComponentDirective, { static: true }) directive!: AEMComponentDirective;
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
class DirectiveComponent extends AbstractMappedComponentDirective {
  @Input() attr1: any;
  @Input() attr2: any;
}

MapTo<DirectiveComponent>('directive/comp')(DirectiveComponent);
LazyMapTo<LazyComponentType>('some/lazy/comp')(() => import('../test/lazy-component-wrapper/lazy.component').then((m) => m.LazyComponent));

describe.skip('AEMComponentDirective', () => {
  const EDIT_CONFIG_EMPTY_LABEL = 'Edit config empty label';

  const TEST_EDIT_CONFIG_EMPTY = {
    emptyLabel: EDIT_CONFIG_EMPTY_LABEL,
    isEmpty: () => {
      return true;
    }
  };

  const TEST_EDIT_CONFIG_NOT_EMPTY = {
    emptyLabel: EDIT_CONFIG_EMPTY_LABEL,
    isEmpty: function () {
      return false;
    }
  };

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: AEMComponentDirective;
  let renderer: Renderer2;
  let viewContainerRef: ViewContainerRef;
  let changeDetectorRef: ChangeDetectorRef;
  let utilsService: UtilsService;
  let componentMappingService: ComponentMappingWithConfigService;

  beforeEach(async () => {
    renderer = {
      setAttribute: jest.fn(),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      removeAttribute: jest.fn()
    } as unknown as Renderer2;

    viewContainerRef = {
      clear: jest.fn(),
      createComponent: jest.fn().mockReturnValue({
        instance: new MockMappedComponent(),
        destroy: jest.fn()
      })
    } as unknown as ViewContainerRef;

    changeDetectorRef = {
      detectChanges: jest.fn()
    } as unknown as ChangeDetectorRef;

    utilsService = {
      isInEditor: jest.fn().mockReturnValue(false)
    } as unknown as UtilsService;

    componentMappingService = {
      get: jest.fn(),
      getLazy: jest.fn().mockResolvedValue(MockMappedComponent),
      getEditConfig: jest.fn()
    } as unknown as ComponentMappingWithConfigService;

    await TestBed.configureTestingModule({
      declarations: [AEMComponentDirective, TestHostComponent, DirectiveComponent, MockMappedComponent],
      providers: [
        { provide: Renderer2, useValue: renderer },
        { provide: ViewContainerRef, useValue: viewContainerRef },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        { provide: UtilsService, useValue: utilsService },
        { provide: ComponentMappingWithConfigService, useValue: componentMappingService }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DirectiveComponent, MockMappedComponent]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directive = component.directive;
    directive.injector = TestBed.inject(Injector);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should call renderComponent when a type is present on init', async () => {
    const mockComponent = MockMappedComponent as Type<MappedComponentProperties>;
    (componentMappingService.get as jest.Mock).mockReturnValue(mockComponent);

    directive.cqItem = { [Constants.TYPE_PROP]: 'mockType' };
    await directive.ngOnInit();

    expect(componentMappingService.get).toHaveBeenCalledWith('mockType');
    expect(viewContainerRef.clear).toHaveBeenCalled();
    expect(viewContainerRef.createComponent).toHaveBeenCalledWith(mockComponent, { injector: directive.injector });
  });

  it('should call initializeAsync when no mapped component is found', async () => {
    (componentMappingService.get as jest.Mock).mockReturnValue(null);
    const initializeAsyncSpy = jest.spyOn(directive, 'initializeAsync').mockResolvedValue();

    directive.cqItem = { [Constants.TYPE_PROP]: 'mockType' };
    await directive.ngOnInit();

    expect(componentMappingService.get).toHaveBeenCalledWith('mockType');
    expect(initializeAsyncSpy).toHaveBeenCalled();
  });

  it('should update component data on changes', () => {
    const mockComponentInstance = {
      testProp: '',
      cqPath: '',
      itemName: ''
    } as MockMappedComponent;

    directive['_component'] = {
      instance: mockComponentInstance,
      destroy: jest.fn() // Mock destroy method
    } as unknown as ComponentRef<MappedComponentProperties>;

    directive.cqItem = { [Constants.TYPE_PROP]: 'mockType', 'testProp': 'testValue' };
    directive.ngOnChanges();

    expect((directive['_component'].instance as any)['testProp']).toBe('testValue');
    expect((directive['_component'].instance as any).cqPath).toBe(directive.cqPath);
    expect((directive['_component'].instance as any).itemName).toBe(directive.itemName || directive.cqItem?.id);
  });

  it('should set up item attributes after view init', () => {
    directive.itemAttrs = { class: 'test-class', id: 'test-id' };
    directive.ngAfterViewInit();

    expect(renderer.addClass).toHaveBeenCalledWith(expect.anything(), 'test-class');
    expect(renderer.setAttribute).toHaveBeenCalledWith(expect.anything(), 'id', 'test-id');
  });

  it('should destroy the component on directive destroy', () => {
    directive['_component'] = { destroy: jest.fn() } as unknown as ComponentRef<MappedComponentProperties>;
    directive.ngOnDestroy();

    expect(directive['_component'].destroy).toHaveBeenCalled();
  });

  it('should handle the use of placeholders correctly', () => {
    const editConfig = { isEmpty: jest.fn().mockReturnValue(true), emptyLabel: 'Empty' };
    (componentMappingService.getEditConfig as jest.Mock).mockReturnValue(editConfig);

    directive.cqItem = { [Constants.TYPE_PROP]: 'mockType' };
    directive['_component'] = { location: { nativeElement: {} } } as unknown as ComponentRef<MappedComponentProperties>;
    directive.updateComponentData();

    expect(renderer.addClass).toHaveBeenCalledWith(directive['_component'].location.nativeElement, 'cq-placeholder');
    expect(renderer.setAttribute).toHaveBeenCalledWith(directive['_component'].location.nativeElement, 'data-emptytext', 'Empty');
  });

  it('should correctly pass the inputs', () => {
    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp',
      appliedCssClassNames: 'applied-css-class1'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const dynamicElement = element.firstElementChild;

    expect(dynamicElement.getAttribute('attr1')).toEqual(componentData['attr1']);
    expect(dynamicElement.getAttribute('attr2')).toEqual(componentData['attr2']);
    expect(dynamicElement.getAttribute('class')).toEqual(componentData['appliedCssClassNames']);
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

    const element = fixture.nativeElement;
    const dynamicElement = element.firstElementChild;

    expect(dynamicElement).toBeNull();
  });

  it('should correctly pass the inputs for lazy component', async () => {
    const componentData = {
      some: 'Some value',
      ':type': 'some/lazy/comp'
    };

    component.data = componentData;

    await import('../test/lazy-component-wrapper/lazy.component');
    fixture.detectChanges();
  });

  it('should setup the placeholder', () => {
    isInEditorSpy.mockReturnValue(true);
    getEditConfigSpy.mockReturnValue(TEST_EDIT_CONFIG_EMPTY);

    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const dynamicElement = element.firstElementChild;

    expect(dynamicElement.dataset.emptytext).toEqual(TEST_EDIT_CONFIG_EMPTY.emptyLabel);
  });

  it('should NOT setup the placeholder', () => {
    isInEditorSpy.mockReturnValue(true);
    getEditConfigSpy.mockReturnValue(TEST_EDIT_CONFIG_NOT_EMPTY);

    const componentData = {
      attr1: 'Some value',
      attr2: 'Another value',
      ':type': 'directive/comp'
    };

    component.data = componentData;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const dynamicElement = element.firstElementChild;

    expect(dynamicElement.dataset.emptytext).toBeUndefined();
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

    const element = fixture.nativeElement;
    const dynamicElement = element.firstElementChild;

    fixture.detectChanges();
    expect(dynamicElement.getAttribute('attr1')).toEqual(null);
    expect(dynamicElement.getAttribute('attr2')).toEqual(componentData1['attr2']);

    component.data = componentData2;
    fixture.detectChanges();
    expect(dynamicElement.getAttribute('attr1')).toEqual(componentData2['attr1']);
    expect(dynamicElement.getAttribute('attr2')).toEqual(componentData2['attr2']);
  });
});
