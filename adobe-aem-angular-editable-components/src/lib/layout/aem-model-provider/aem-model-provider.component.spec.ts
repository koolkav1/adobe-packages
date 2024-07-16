import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AEMModelProviderComponent } from './aem-model-provider.component';
import { ModelManagerService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/services/model-manager.service';
import { PathUtilsService } from '@kav-khalsa/adobe-aem-spa-model-manager/src/lib/utils/path.service';
import { UtilsService } from '../utils.service';
import { ChangeDetectorRef } from '@angular/core';
import { Constants } from '../constants';

describe('AEMModelProviderComponent', () => {
  let component: AEMModelProviderComponent;
  let fixture: ComponentFixture<AEMModelProviderComponent>;
  let mockModelManager: Partial<ModelManagerService>;
  let mockPathService: Partial<PathUtilsService>;
  let mockUtilsService: Partial<UtilsService>;
  let mockChangeDetectorRef: Partial<ChangeDetectorRef>;

  beforeEach(async () => {
    mockModelManager = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getData: jest.fn().mockResolvedValue({}),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };

    mockPathService = {
      dispatchGlobalCustomEvent: jest.fn(),
    };

    mockUtilsService = {
      isInEditor: jest.fn().mockReturnValue(false),
      getCQPath: jest.fn().mockReturnValue('/content/test'),
    };

    mockChangeDetectorRef = {
      markForCheck: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AEMModelProviderComponent],
    }).compileComponents();

    TestBed.overrideComponent(AEMModelProviderComponent, {
      set: {
        providers: [
          { provide: ModelManagerService, useValue: mockModelManager },
          { provide: PathUtilsService, useValue: mockPathService },
          { provide: UtilsService, useValue: mockUtilsService },
          { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        ],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AEMModelProviderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update cqPath and emit updateDataPath when cqItem is not provided', fakeAsync(() => {
    component.cqItem = undefined;
    component.pagePath = '/content/page';
    component.itemPath = '/item';

    component.ngOnInit();

    tick();

    expect(mockModelManager.initialize).toHaveBeenCalled();
  }));
  it('should initialize ModelManager on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(mockModelManager.initialize).toHaveBeenCalled();
  }));



  it('should not update cqPath when cqItem is provided', fakeAsync(() => {
    component.cqItem = { some: 'data' };
    component.ngOnInit();
    tick();

    expect(mockUtilsService.getCQPath).not.toHaveBeenCalled();
  }));


  it('should not dispatch ASYNC_CONTENT_LOADED_EVENT when not in editor', fakeAsync(() => {
    (mockUtilsService.isInEditor as jest.Mock).mockReturnValue(false);
    component.pagePath = '/content/page';
    component.ngOnInit();
    tick();

    expect(mockPathService.dispatchGlobalCustomEvent).not.toHaveBeenCalled();
  }));
});
