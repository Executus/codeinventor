import { Behaviour } from './behaviour';
import { Property } from './property';
import { Object } from './object';
import { PropertyVector2d } from './property-vector2d';
import { RuntimeService } from '../runtime/runtime.service';
import { BehaviourTransform } from './behaviour-transform';

export class BehaviourSprite implements Behaviour {
  name: string;
  properties: Property[];
  attachedObject: Object;

  public Size: PropertyVector2d;

  constructor(owner: Object, private runtimeService: RuntimeService) {
    this.name = 'Sprite';
    this.properties = [];
    this.attachedObject = owner;

    this.Size = new PropertyVector2d('Size', 300, 300);
    this.properties.push(this.Size);
  }

  update(): void {
    
  }

  draw(): void {
    let transform: BehaviourTransform = this.attachedObject.getBehaviour<BehaviourTransform>('BehaviourTransform');
    if (transform) {
      let posX = transform.WorldPosition.X;
      let posY = transform.WorldPosition.Y;

      let gl = this.runtimeService.getGlContext();

      if (gl === null) {
        return;
      }

      let programInfo = this.runtimeService.getShaderProgramInfo();

      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Apply size
      let vert1x = -(this.Size.X / 2); let vert1y = -(this.Size.Y / 2);     // Top left vertex
      let vert2x = -(this.Size.X / 2); let vert2y =  (this.Size.Y / 2);     // Bottom left vertex
      let vert3x =  (this.Size.X / 2); let vert3y =  (this.Size.Y / 2);     // Bottom right vertex

      let vert4x =  (this.Size.X / 2); let vert4y =  (this.Size.Y / 2);     // Bottom right vertex
      let vert5x =  (this.Size.X / 2); let vert5y = -(this.Size.Y / 2);     // Top right vertex
      let vert6x = -(this.Size.X / 2); let vert6y = -(this.Size.Y / 2);     // Top left vertex

      // Apply rotation
      let rot = transform.Rotation.Value;
      if (rot != 0.0) {
        let tanTheta = (this.Size.Y / 2) / (this.Size.X / 2);
        let theta = Math.atan(tanTheta);

        // Convert to degrees
        theta = theta * (180.0 / Math.PI);

        // Radius from the origin to each vertex should be the same
        let radius = Math.hypot(vert1x, vert1y);

        vert1x = radius * Math.cos(((180 + theta) - rot) * (Math.PI / 180.0)); vert1y = radius * Math.sin(((180 + theta) - rot) * (Math.PI / 180.0));
        vert2x = radius * Math.cos(((180 - theta) - rot) * (Math.PI / 180.0)); vert2y = radius * Math.sin(((180 - theta) - rot) * (Math.PI / 180.0));
        vert3x = radius * Math.cos((theta - rot) * (Math.PI / 180.0)); vert3y = radius * Math.sin((theta - rot) * (Math.PI / 180.0));

        vert4x = radius * Math.cos((theta - rot) * (Math.PI / 180.0)); vert4y = radius * Math.sin((theta - rot) * (Math.PI / 180.0));
        vert5x = radius * Math.cos(((360 - theta) - rot) * (Math.PI / 180.0)); vert5y = radius * Math.sin(((360 - theta) - rot) * (Math.PI / 180.0));
        vert6x = radius * Math.cos(((180 + theta) - rot) * (Math.PI / 180.0));         vert6y = radius * Math.sin(((180 + theta) - rot) * (Math.PI / 180.0));
      }

      // Apply translation
      vert1x += posX; vert1y += posY;
      vert2x += posX; vert2y += posY;
      vert3x += posX; vert3y += posY;

      vert4x += posX; vert4y += posY;
      vert5x += posX; vert5y += posY;
      vert6x += posX; vert6y += posY;

      // 2 triangles to make a quad, 3 vertices each
      const positions = [
        vert1x, vert1y,     // Top left vertex
        vert2x, vert2y,     // Bottom left vertex
        vert3x, vert3y,     // Bottom right vertex

        vert4x, vert4y,     // Bottom right vertex
        vert5x, vert5y,     // Top right vertex
        vert6x, vert6y,     // Top left vertex
      ];

      gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(positions),
                        gl.STATIC_DRAW);
      
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      let size = 2;               // 2 components per iteration
      let type = gl.FLOAT;   // the data is 32bit floats
      let normalize = false;      // don't normalize the data
      let stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
      let offset = 0;             // start at the beginning of the buffer

      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

      gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);

      let primitiveType = gl.TRIANGLES;
      let drawOffset = 0;
      let count = 6;
      gl.drawArrays(primitiveType, drawOffset, count);
    }
  }

  getAttachedObject(): Object {
    return this.attachedObject;
  }
}
