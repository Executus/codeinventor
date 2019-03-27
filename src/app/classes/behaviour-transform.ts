import { Behaviour } from './behaviour';
import { Property } from './property';
import { PropertyVector2d } from './property-vector2d';
import { PropertyFloat } from './property-float';
import { Object } from './object';

export class BehaviourTransform implements Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  private localPos: PropertyVector2d;
  private worldPos: PropertyVector2d;

  constructor(owner: Object) {
    this.name = 'Transform';
    this.properties = [];
    this.attachedObject = owner;

    this.worldPos = new PropertyVector2d();

    this.localPos = new PropertyVector2d();
    this.localPos.name = 'Position';
    this.localPos.setXValue(0.0);
    this.localPos.setYValue(0.0);
    this.properties.push(this.localPos);

    let scale = new PropertyVector2d();
    scale.name = 'Scale';
    scale.setXValue(1.0);
    scale.setYValue(1.0);
    this.properties.push(scale);

    let rot = new PropertyFloat();
    rot.name = 'Rotation';
    rot.setValue(0.0);
    this.properties.push(rot);
  }

  update(): void {
    this.worldPos.setXValue(this.localPos.x());
    this.worldPos.setYValue(this.localPos.y());
    
    let parentObject: Object = this.attachedObject.getParent();
    if (parentObject) {
      let parentTransform: BehaviourTransform = parentObject.getBehaviour<BehaviourTransform>('BehaviourTransform');
      if (parentTransform) {
        this.worldPos.setXValue(parentTransform.worldPos.x() + this.localPos.x());
        this.worldPos.setYValue(parentTransform.worldPos.y() + this.localPos.y());
      }
    }
  }

  draw(): void {
    
  }

  getAttachedObject(): Object {
    return this.attachedObject;
  }

}
