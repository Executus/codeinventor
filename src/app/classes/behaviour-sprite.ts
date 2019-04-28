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

      // 2 triangles to make a quad, 3 vertices each
      const positions = [
        posX - this.Size.X / 2, posY - this.Size.Y / 2,     // Top left vertex
        posX - this.Size.X / 2, posY + this.Size.Y / 2,     // Bottom left vertex
        posX + this.Size.X / 2, posY + this.Size.Y / 2,     // Bottom right vertex

        posX + this.Size.X / 2, posY + this.Size.Y / 2,     // Bottom right vertex
        posX + this.Size.X / 2, posY - this.Size.Y / 2,     // Top right vertex
        posX - this.Size.X / 2, posY - this.Size.Y / 2,     // Top left vertex
      ];

      gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(positions),
                        gl.STATIC_DRAW);

      const buffers = {
        position: positionBuffer
      };
      
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
