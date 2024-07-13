import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdobeAemSpaModelManagerComponent } from './adobe-aem-spa-model-manager.component';

describe('AdobeAemSpaModelManagerComponent', () => {
  let component: AdobeAemSpaModelManagerComponent;
  let fixture: ComponentFixture<AdobeAemSpaModelManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdobeAemSpaModelManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdobeAemSpaModelManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
