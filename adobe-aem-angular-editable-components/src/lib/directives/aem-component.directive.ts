import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    Type,
    ViewContainerRef
  } from '@angular/core';
  
  import { Constants } from '../layout/constants';
  import { UtilsService } from '../layout/utils.service';
  import { MappedComponentProperties } from '../models/mapped-component-properties.interface';
  import { ComponentMappingWithConfigService } from '../layout/component-mapping-with-config.service';
  
  const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';
  
  @Directive({
    selector: '[aemComponent]'
  })
  export class AEMComponentDirective implements AfterViewInit, OnInit, OnDestroy, OnChanges {
    @Input() cqPath: string = '';
    @Input() itemName: string = '';
    @Input() itemAttrs: any;
    @Input() loaded: boolean = false;
    @Input() aemComponent: any;
  
    private _component!: ComponentRef<MappedComponentProperties>;
    private _cqItem: any;
  
    constructor(
      private renderer: Renderer2,
      private viewContainer: ViewContainerRef,
      private changeDetectorRef: ChangeDetectorRef,
      private utils: UtilsService,
      private componentMapping: ComponentMappingWithConfigService,
      public injector: Injector
    ) {}
  
    get cqItem(): any {
      return this._cqItem;
    }
  
    @Input()
    set cqItem(value: any) {
      this._cqItem = value;
    }
  
    async ngOnInit() {
      if (this.type) {
        const mappedComponent = this.componentMapping.get<MappedComponentProperties>(this.type);
  
        if (mappedComponent) {
          this.renderComponent(mappedComponent);
        } else {
          await this.initializeAsync();
        }
      } else {
        console.warn('No type on ' + this.cqPath);
      }
    }
  
    async initializeAsync() {
      try {
        if (this.type) {
          const lazyMappedComponent = await this.componentMapping.getLazy<MappedComponentProperties>(this.type);
          if (!lazyMappedComponent) {
            throw new Error(`No component definition for type ${this.type}`);
          }
          this.renderComponent(lazyMappedComponent);
          this.loaded = true;
          this.changeDetectorRef.detectChanges();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  
    ngOnChanges(): void {
      this.updateComponentData();
    }
  
    ngAfterViewInit(): void {
      this.setupItemAttrs();
    }
  
    ngOnDestroy(): void {
      if (this._component) {
        this._component.destroy();
      }
    }
  
    private get type(): string | undefined {
      return this.cqItem && this.cqItem[Constants.TYPE_PROP];
    }
  
    private renderComponent(componentDefinition: Type<MappedComponentProperties>) {
      if (!componentDefinition) {
        throw new Error('No component definition!!');
      }
  
      this.viewContainer.clear();
      this._component = this.viewContainer.createComponent(componentDefinition, { injector: this.injector });
      this.updateComponentData();
    }
  
    public updateComponentData() {
      if (!this._component || !this._component.instance || !this.cqItem) {
        return;
      }
  
      Object.keys(this.cqItem).forEach((key) => {
        const propKey = key.startsWith(':') ? `cq${key.charAt(1).toUpperCase()}${key.slice(2)}` : key;
        (this._component.instance as any)[propKey] = this.cqItem[key];
      });
  
      this._component.instance.cqPath = this.cqPath;
      this._component.instance.itemName = this.itemName || this.cqItem?.id;
      this.includeAppliedCSSClasses();
  
      if (this.type) {
        const editConfig = this.componentMapping.getEditConfig(this.type);
        if (editConfig && this.utils.isInEditor()) {
          this.setupPlaceholder(editConfig);
        }
      }
  
      this.changeDetectorRef.detectChanges();
    }
  
    private includeAppliedCSSClasses() {
      const appliedCssClassNames = this.cqItem[Constants.APPLIED_CLASS_NAMES] || '';
      if (appliedCssClassNames && this._component) {
        this.renderer.setAttribute(this._component.location.nativeElement, 'class', appliedCssClassNames);
      }
    }
  
    private setupItemAttrs() {
      if (this.itemAttrs) {
        Object.keys(this.itemAttrs).forEach((key) => {
          if (key === 'class') {
            this.itemAttrs[key].split(' ').forEach((itemClass: string) => {
              this.renderer.addClass(this._component.location.nativeElement, itemClass);
            });
          } else {
            this.renderer.setAttribute(this._component.location.nativeElement, key, this.itemAttrs[key]);
          }
        });
      }
    }
  
    private usePlaceholder(editConfig: any): boolean {
      return editConfig.isEmpty && typeof editConfig.isEmpty === 'function' && editConfig.isEmpty(this.cqItem);
    }
  
    private setupPlaceholder(editConfig: any) {
      if (this.usePlaceholder(editConfig)) {
        this.renderer.addClass(this._component.location.nativeElement, PLACEHOLDER_CLASS_NAME);
        this.renderer.setAttribute(this._component.location.nativeElement, 'data-emptytext', editConfig.emptyLabel);
      } else {
        this.renderer.removeClass(this._component.location.nativeElement, PLACEHOLDER_CLASS_NAME);
        this.renderer.removeAttribute(this._component.location.nativeElement, 'data-emptytext');
      }
    }
  }
  