import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMResponsiveGridComponent } from './aem-responsive-grid.component';
import { AEMAllowedComponentsContainerComponent } from '../aem-allowed-components-container/aem-allowed-components-container.component';
import { Constants } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/common/constants';

jest.mock('../aem-allowed-components-container/aem-allowed-components-container.component');

describe('AEMResponsiveGridComponent', () => {
  let component: AEMResponsiveGridComponent;
  let fixture: ComponentFixture<AEMResponsiveGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AEMResponsiveGridComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AEMResponsiveGridComponent);
    component = fixture.componentInstance;
    component.gridClassNames = '';
    component.columnClassNames = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getColumnClassNames', () => {
    it('should return column class names for a given key', () => {
      component.columnClassNames = { 'item1': 'class1 class2' };
      expect(component.getColumnClassNames('item1')).toBe('class1 class2');
    });

    it('should return undefined if columnClassNames is empty', () => {
      component.columnClassNames = {};
      expect(component.getColumnClassNames('item1')).toBeUndefined();
    });
  });

  describe('getPlaceholderClassNames', () => {
    it('should append PLACEHOLDER_CLASS_NAMES to super.getPlaceholderClassNames()', () => {
      jest.spyOn(AEMAllowedComponentsContainerComponent.prototype, 'getPlaceholderClassNames').mockReturnValue('superClass');
      expect(component.getPlaceholderClassNames()).toBe('superClass aem-Grid-newComponent');
    });
  });

  describe('getHostClassNames', () => {
    it('should combine super.getHostClassNames(), classNames, and gridClassNames', () => {
      jest.spyOn(AEMAllowedComponentsContainerComponent.prototype, 'getHostClassNames').mockReturnValue('superClass');
      component.classNames = 'customClass';
      component.gridClassNames = 'gridClass';
      expect(component.getHostClassNames()).toBe('superClass customClass gridClass');
    });

    it('should handle empty classNames', () => {
      jest.spyOn(AEMAllowedComponentsContainerComponent.prototype, 'getHostClassNames').mockReturnValue('superClass');
      component.classNames = '';
      component.gridClassNames = 'gridClass';
      expect(component.getHostClassNames()).toBe('superClass gridClass');
    });
  });

  describe('getAttrDataPath', () => {
    it('should return null for responsive grid type', () => {
      jest.spyOn(component, 'getItem').mockReturnValue({ [Constants.TYPE_PROP]: 'wcm/foundation/components/responsivegrid' });
      expect(component.getAttrDataPath('somePath')).toBeNull();
    });

    it('should return data path for non-responsive grid type', () => {
      jest.spyOn(component, 'getItem').mockReturnValue({ [Constants.TYPE_PROP]: 'someOtherType' });
      jest.spyOn(component, 'getDataPath').mockReturnValue('dataPath');
      expect(component.getAttrDataPath('somePath')).toBe('dataPath');
    });

    it('should return data path when getItem returns undefined', () => {
      jest.spyOn(component, 'getItem').mockReturnValue(undefined);
      jest.spyOn(component, 'getDataPath').mockReturnValue('dataPath');
      expect(component.getAttrDataPath('somePath')).toBe('dataPath');
    });
  });
});