import { MappedComponentProperties } from './mapped-component-properties.interface';

export interface EditConfig<P extends MappedComponentProperties = any> {
  emptyLabel?: string;
  isEmpty(props: P): boolean;
}
