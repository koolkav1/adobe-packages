import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewContainerRef, Type, isStandalone, ChangeDetectorRef, Injector } from '@angular/core';
import { AEMComponentDirective } from './aem-component.directive';
import { UtilsService } from '../layout/utils.service';
import { ComponentMappingWithConfigService } from '../layout/component-mapping-with-config.service';
import { MappedComponentProperties } from '../models/mapped-component-properties.interface';
import { Constants } from '../layout/constants';

@Component({
  template: '<div [aemComponent]="aemComponent" [cqItem]="cqItem" [cqPath]="cqPath"></div>',
  standalone: true,
  imports:[AEMComponentDirective]
})
class TestComponent {
  aemComponent: any;
  cqItem: any;
  cqPath = '';
}

@Component({
  selector: 'mock-mapped-component',
  template: '<div>Mock Component</div>',
  standalone: true
})
class MockMappedComponent implements MappedComponentProperties {
  cqPath = '';
  itemName = '';
}

describe('AEMComponentDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: AEMComponentDirective;
  let utilsServiceMock: jest.Mocked<UtilsService>;
  let componentMappingServiceMock: jest.Mocked<ComponentMappingWithConfigService>;

  beforeEach(async () => {
    utilsServiceMock = {
      isInEditor: jest.fn().mockReturnValue(false)
    } as any;

    componentMappingServiceMock = {
      get: jest.fn(),
      getLazy: jest.fn(),
      getEditConfig: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [TestComponent, AEMComponentDirective, MockMappedComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: ComponentMappingWithConfigService, useValue: componentMappingServiceMock },
        AEMComponentDirective,
        ChangeDetectorRef,
        Injector,
        ViewContainerRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.aemComponent = {'test': 'test'};
    directive = fixture.debugElement.children[0].injector.get(AEMComponentDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set cqItem and type when cqItem is set', () => {
    const mockCqItem = { [Constants.TYPE_PROP]: 'someType' };
    component.cqItem = mockCqItem;
    fixture.detectChanges();

    expect(directive['_cqItem']).toEqual(mockCqItem);
    expect(directive['_type']).toEqual('someType');
  });

  it.skip('should call renderComponent when type is available and component is mapped', async () => {
    componentMappingServiceMock.get.mockReturnValue(MockMappedComponent);
    const renderComponentSpy = jest.spyOn(directive as any, 'renderComponent');

    component.cqItem = { [Constants.TYPE_PROP]: 'someType' };
    fixture.detectChanges();
    await fixture.whenStable();

    expect(componentMappingServiceMock.get).toHaveBeenCalledWith('someType');
    expect(renderComponentSpy).toHaveBeenCalledWith(MockMappedComponent);
  });

  it.skip('should call initializeAsync when type is available but component is not immediately mapped', async () => {
    componentMappingServiceMock.get.mockReturnValue(undefined as unknown as any);
    componentMappingServiceMock.getLazy.mockResolvedValue(MockMappedComponent);
    const initializeAsyncSpy = jest.spyOn(directive as any, 'initializeAsync');

    component.cqItem = { [Constants.TYPE_PROP]: 'someType' };
    fixture.detectChanges();
    await fixture.whenStable();

    expect(initializeAsyncSpy).toHaveBeenCalled();
    expect(componentMappingServiceMock.getLazy).toHaveBeenCalledWith('someType');
  });

  it('should update component data when cqItem changes', async () => {
    componentMappingServiceMock.get.mockReturnValue(MockMappedComponent);
    component.cqItem = { [Constants.TYPE_PROP]: 'someType', someProperty: 'someValue' };
    fixture.detectChanges();
    await fixture.whenStable();

    const updateComponentDataSpy = jest.spyOn(directive as any, 'updateComponentData');
    component.cqItem = { [Constants.TYPE_PROP]: 'someType', someProperty: 'newValue' };
    fixture.detectChanges();
    await fixture.whenStable();

    expect(updateComponentDataSpy).toHaveBeenCalled();
  });
});