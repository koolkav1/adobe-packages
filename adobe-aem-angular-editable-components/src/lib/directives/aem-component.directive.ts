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
    Type,
    ViewContainerRef,
    inject
  } from '@angular/core';
  
  import { Constants } from '../layout/constants';
  import { UtilsService } from '../layout/utils.service';
  import { MappedComponentProperties } from '../models/mapped-component-properties.interface';
  import { ComponentMappingWithConfigService } from '../layout/component-mapping-with-config.service';
  
  export const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';
  
  @Directive({
    selector: '[aemComponent]',
    standalone: true,
    providers: [ComponentMappingWithConfigService, UtilsService]
  })
  export class AEMComponentDirective implements AfterViewInit, OnInit, OnDestroy, OnChanges {
    @Input() cqPath = '';
    @Input() itemName = '';
    @Input() itemAttrs: any;
    @Input() loaded = false;
    @Input() aemComponent: any;
  
    private _component!: ComponentRef<MappedComponentProperties>;
    private _cqItem: any;
    private _type: string | undefined;
  
    private viewContainer = inject(ViewContainerRef) ;
    private changeDetectorRef = inject( ChangeDetectorRef);
    private utils = inject( UtilsService);
    private componentMapping = inject(ComponentMappingWithConfigService) ;
    public injector = inject( Injector);
  
    get cqItem(): any {
      return this._cqItem;
    }
  
    @Input()
    set cqItem(value: any) {
      this._cqItem = value;
      this._type = value?.[Constants.TYPE_PROP];
    }
  
    get type(): string | undefined {
      return this._type;
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
        this._component.location.nativeElement.className = appliedCssClassNames;
      }
    }
  
    private setupItemAttrs() {
      if (this.itemAttrs) {
        Object.keys(this.itemAttrs).forEach((key) => {
          if (key === 'class') {
            this.itemAttrs[key].split(' ').forEach((itemClass: string) => {
              this._component.location.nativeElement.classList.add(itemClass);
            });
          } else {
            this._component.location.nativeElement.setAttribute(key, this.itemAttrs[key]);
          }
        });
      }
    }
  
    private usePlaceholder(editConfig: any): boolean {
      return editConfig.isEmpty && typeof editConfig.isEmpty === 'function' && editConfig.isEmpty(this.cqItem);
    }
  
    private setupPlaceholder(editConfig: any) {
      if (this.usePlaceholder(editConfig)) {
        this._component.location.nativeElement.classList.add(PLACEHOLDER_CLASS_NAME);
        this._component.location.nativeElement.setAttribute('data-emptytext', editConfig.emptyLabel);
      } else {
        this._component.location.nativeElement.classList.remove(PLACEHOLDER_CLASS_NAME);
        this._component.location.nativeElement.removeAttribute('data-emptytext');
      }
    }
  }
  