import { Property } from './property';
import { Object } from './object';
import { RuntimeService } from '../runtime/runtime.service';

export interface Behaviour {
  name: string;
  properties;
  attachedObject: Object;
  instanceId: number;

  init(runtimeService: RuntimeService): void;
  update(runtimeService: RuntimeService): void;
  draw(runtimeService: RuntimeService): void;
  getAttachedObject(): Object;
}
