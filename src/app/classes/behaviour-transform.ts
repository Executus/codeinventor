import { Behaviour } from './behaviour';
import { Property } from './property';
import { PropertyVector2d } from './property-vector2d';
import { PropertyFloat } from './property-float';
import { Object } from './object';

export class BehaviourTransform implements Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  public LocalPosition: PropertyVector2d;
  public WorldPosition: PropertyVector2d;
  public Rotation: PropertyFloat;

  constructor(owner: Object) {
    this.name = 'Transform';
    this.properties = [];
    this.attachedObject = owner;

    this.WorldPosition = new PropertyVector2d();

    this.LocalPosition = new PropertyVector2d('Position', 0.0, 0.0);
    this.properties.push(this.LocalPosition);

    let scale = new PropertyVector2d('Scale', 1.0, 1.0);
    this.properties.push(scale);

    this.Rotation = new PropertyFloat('Rotation', 0.0);
    this.properties.push(this.Rotation);
  }

  init(): void {
    
  }

  update(): void {
    this.WorldPosition.X = this.LocalPosition.X;
    this.WorldPosition.Y = this.LocalPosition.Y;
    
    let parentObject: Object = this.attachedObject.getParent();
    if (parentObject) {
      let parentTransform: BehaviourTransform = parentObject.getBehaviour<BehaviourTransform>('BehaviourTransform');
      if (parentTransform) {
        this.WorldPosition.X = parentTransform.WorldPosition.X + this.LocalPosition.X;
        this.WorldPosition.Y = parentTransform.WorldPosition.Y + this.LocalPosition.Y;
      }
    }
  }

  draw(): void {
    
  }

  getAttachedObject(): Object {
    return this.attachedObject;
  }

}
