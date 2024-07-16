import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMContainerComponent } from './aem-container.component';
import { Component, Input } from '@angular/core';
import { UtilsService } from '../utils.service';
import { Model } from '../../../mocks/model';
import { CONTAINER_CLASS_NAMES, PLACEHOLDER_CLASS_NAMES, PLACEHOLDER_ITEM_NAME } from './aem-container.const';

@Component({
  selector: 'mock-component',
  template: '',
  standalone: true
})
class MockComponent {
  @Input() cqItems: any;
  @Input() cqItemsOrder?: string[];
  @Input() classNames?: string;
  @Input() modelName?: string;
  @Input() cqPath?: string;
}

describe('AEMContainerComponent', () => {
  let component: AEMContainerComponent;
  let fixture: ComponentFixture<AEMContainerComponent>;
  let utilsService: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AEMContainerComponent, MockComponent],
      providers: [
        {
          provide: UtilsService,
          useValue: { isInEditor: jest.fn().mockReturnValue(true) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AEMContainerComponent);
    component = fixture.componentInstance;
    utilsService = TestBed.inject(UtilsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct data path', () => {
    component.cqPath = 'root/path';
    expect(component.getDataPath('child')).toBe('root/path/child');
    component.cqPath = '';
    expect(component.getDataPath('child')).toBe('child');
  });

  it('should return the correct item', () => {
    const mockItem: Model = { data: 'mockData' };
    component.cqItems = { item1: mockItem };
    expect(component.getItem('item1')).toBe(mockItem);
    expect(component.getItem('nonexistent')).toBeUndefined();
  });

  it('should return correct class names', () => {
    expect(component.getHostClassNames()).toBe(CONTAINER_CLASS_NAMES);
    expect(component.hostClasses).toBe(CONTAINER_CLASS_NAMES);
  });

  it('should return correct placeholder class names', () => {
    expect(component.getPlaceholderClassNames()).toBe(PLACEHOLDER_CLASS_NAMES);
  });

  it('should return correct placeholder path', () => {
    component.cqPath = 'root/path';
    expect(component.placeholderPath).toBe('root/path/' + PLACEHOLDER_ITEM_NAME);
  });

  it.skip('should call isInEditor from utilsService', () => {
    const isInEditMode = component.isInEditMode;
    expect(utilsService.isInEditor).toHaveBeenCalled();
    expect(isInEditMode).toBe(true);
  });

  it('should apply host classes and data-cq-data-path attribute', () => {
    component.cqPath = 'root/path';
    fixture.detectChanges();
    const hostElement = fixture.debugElement.nativeElement;
    expect(hostElement).toBeTruthy();
    expect(hostElement.getAttribute('data-cq-data-path')).toBe('root/path');
    expect(hostElement.classList.contains(CONTAINER_CLASS_NAMES)).toBeTruthy();
  });
});
