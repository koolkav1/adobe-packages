import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AEMPageComponent } from './aem-page.component';
import { AEMContainerComponent } from '../aem-container/aem-container.component';
import { Component } from '@angular/core';

// Create a test wrapper component
@Component({
  template: '<aem-page></aem-page>',
  standalone: true,
  imports: [AEMPageComponent]
})
class TestWrapperComponent {}

describe('AEMPageComponent', () => {
  let component: AEMPageComponent;
  let wrapperFixture: ComponentFixture<TestWrapperComponent>;
  let pageElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AEMPageComponent, AEMContainerComponent, TestWrapperComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    wrapperFixture = TestBed.createComponent(TestWrapperComponent);
    wrapperFixture.detectChanges();
    pageElement = wrapperFixture.nativeElement.querySelector('aem-page');
    component = wrapperFixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend AEMContainerComponent', () => {
    expect(component instanceof AEMContainerComponent).toBeTruthy();
  });

  describe('getDataPath', () => {
    it('should return the path when cqPath is not set', () => {
      component.cqPath = '';
      expect(component.getDataPath('test/path')).toBe('test/path');
    });

    it('should return the aggregated path when cqPath is set', () => {
      component.cqPath = '/content/mypage';
      expect(component.getDataPath('test/path')).toBe('/content/mypage/jcr:content/test/path');
    });
  });

  describe('host bindings', () => {
    it('should set the data-cq-data-path attribute based on cqPath property', () => {
      component.cqPath = '/content/mypage';
      wrapperFixture.detectChanges();
      expect(pageElement.getAttribute('data-cq-data-path')).toBe('/content/mypage');
    });

    // Note: We can't directly test hostClasses as it's read-only.
    // If it's set internally by the component, we might test its effect like this:
    it('should have the correct class applied', () => {
      // Assuming the component sets some default class internally
      wrapperFixture.detectChanges();
      expect(pageElement.classList.length).toBeGreaterThan(0);
      // You might check for specific classes if you know what the component should set
    });
  });
});