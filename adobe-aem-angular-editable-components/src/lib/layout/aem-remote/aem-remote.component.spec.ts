import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMRemoteComponent } from './aem-remote.component';
import { Component, Input } from '@angular/core';
import { ModelManagerService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/services/model-manager.service';
import { PathUtilsService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/utils/path.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'aem-model-provider',
  template: '<ng-content></ng-content>',
  standalone: true
})
class MockAEMModelProviderComponent {
  @Input() pagePath = '';
  @Input() itemPath = '';
  @Input() cqPath = '';
}

describe('AEMRemoteComponent', () => {
  let component: AEMRemoteComponent;
  let fixture: ComponentFixture<AEMRemoteComponent>;

  beforeEach(async () => {
    const mockModelManager = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getData: jest.fn().mockResolvedValue({}),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };

    const mockPathService = {
      dispatchGlobalCustomEvent: jest.fn(),
    };

    const mockUtilsService = {
      isInEditor: jest.fn().mockReturnValue(false),
      getCQPath: jest.fn().mockReturnValue('/content/test'),
    };

    await TestBed.configureTestingModule({
      imports: [AEMRemoteComponent, MockAEMModelProviderComponent],
      providers: [
        { provide: ModelManagerService, useValue: mockModelManager },
        { provide: PathUtilsService, useValue: mockPathService },
        { provide: UtilsService, useValue: mockUtilsService },
      ]
    }).compileComponents();

    TestBed.overrideComponent(AEMRemoteComponent, {
      set: {
        imports: [MockAEMModelProviderComponent]
      }
    });

    fixture = TestBed.createComponent(AEMRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty string for pagePath', () => {
    expect(component.pagePath).toBe('');
  });

  it('should have default empty string for itemPath', () => {
    expect(component.itemPath).toBe('');
  });

  it('should have undefined cqPath by default', () => {
    expect(component.cqPath).toBeUndefined();
  });

  it('should set pagePath input correctly', () => {
    const testPath = '/content/test-page';
    component.pagePath = testPath;
    expect(component.pagePath).toBe(testPath);
  });

  it('should set itemPath input correctly', () => {
    const testPath = '/test-item';
    component.itemPath = testPath;
    expect(component.itemPath).toBe(testPath);
  });

  describe('setDataPath', () => {
    it('should set cqPath when called with an event object', () => {
      const testEvent = { cqPath: '/content/test-page/jcr:content/root/container' };
      component.setDataPath(testEvent);
      expect(component.cqPath).toBe(testEvent.cqPath);
    });

    it('should overwrite existing cqPath when called', () => {
      component.cqPath = '/old/path';
      const testEvent = { cqPath: '/new/path' };
      component.setDataPath(testEvent);
      expect(component.cqPath).toBe(testEvent.cqPath);
    });
  });

  // Test for the presence of AEMModelProviderComponent in the template
  it('should include AEMModelProviderComponent in the template', () => {
    const aemModelProviderElement = fixture.nativeElement.querySelector('aem-model-provider');
    expect(aemModelProviderElement).toBeTruthy();
  });
});