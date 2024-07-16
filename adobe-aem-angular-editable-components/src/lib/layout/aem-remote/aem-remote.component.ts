import { Component, Input } from '@angular/core';
import { AEMModelProviderComponent } from '../aem-model-provider/aem-model-provider.component';

@Component({
  selector: 'aem-remote-component',
  templateUrl: './aem-remote.component.html',
  standalone: true,
  imports: [AEMModelProviderComponent]
})

export class AEMRemoteComponent {
  @Input() pagePath = '';
  @Input() itemPath = '';
  @Input() cqPath?: string;

  setDataPath(e: any): void {
    this.cqPath = e.cqPath;
  }
}