import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMAllowedComponentsContainerComponent } from './aem-allowed-components-container.component';
import { AEMContainerComponent } from '../aem-container/aem-container.component';
import { ALLOWED_PLACEHOLDER_CLASS_NAMES, ALLOWED_COMPONENT_TITLE_CLASS_NAMES, ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES } from './aem-allowed-components.const';

// Mock AEMContainerComponent
class MockAEMContainerComponent {
  cqPath = '';
  getPlaceholderClassNames() {
    return 'mock-placeholder-class';
  }
  getItem(itemKey: string) {
    return undefined;
  }
}

describe('AEMAllowedComponentsContainerComponent', () => {
  let component: AEMAllowedComponentsContainerComponent;
  let fixture: ComponentFixture<AEMAllowedComponentsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AEMAllowedComponentsContainerComponent ],
      providers: [
        { provide: AEMContainerComponent, useClass: MockAEMContainerComponent }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AEMAllowedComponentsContainerComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'isInEditMode', {
      get: jest.fn(() => true),
      configurable: true
    });

    fixture.detectChanges();
  });


  it('should have cqPath input', () => {
    component.cqPath = '/content/test';
    expect(component.cqPath).toBe('/content/test');
  });

  it('should return undefined when getItem is called', () => {
    expect(component.getItem('testKey')).toBeUndefined();
  });

});