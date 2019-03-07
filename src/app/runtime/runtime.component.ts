import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html',
  styleUrls: ['./runtime.component..scss']
})
export class RuntimeComponent implements OnInit {

  private gl;
  private programInfo;

  private vsSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;

    void main() {
      // convert from pixels to 0.0 -> 1.0
      vec2 zeroToOne = a_position / u_resolution;

      // convert from 0 -> 1 to 0 -> 2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // convert from 0 -> 2 to -1 -> +1
      vec2 clipSpace = zeroToTwo -  1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
  `;

  private fsSource = `
    void main() {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `;

  constructor() {}

  ngOnInit() {
    let canvas = document.querySelector('#glCanvas');
    this.gl = canvas.getContext('webgl');

    if (this.gl === null) {
      alert('Unable to intialise WebGL. Your browser may not support it.');
      return;
    }

    // Set the clear color to black
    this.gl.clearColor(0, 0, 0, 1);
    // Apply the clear color to color buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Create the shader program
    const shaderProgram = this.initShaderProgram(this.vsSource, this.fsSource);

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'a_position')
      },
      uniformLocations: {
        resolution: this.gl.getUniformLocation(shaderProgram, 'u_resolution')
      }
    }

    setInterval(function(context) {
      context.drawScene();
    }, 20, this);
  }

  private drawScene() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.programInfo.program);
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

    const buffers = this.initBuffers();
    
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2;               // 2 components per iteration
    let type = this.gl.FLOAT;   // the data is 32bit floats
    let normalize = false;      // don't normalize the data
    let stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;             // start at the beginning of the buffer

    this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

    this.gl.uniform2f(this.programInfo.uniformLocations.resolution, this.gl.canvas.width, this.gl.canvas.height);

    let primitiveType = this.gl.TRIANGLE_STRIP;
    let drawOffset = 0;
    let count = 4;
    this.gl.drawArrays(primitiveType, drawOffset, count);
  }

  private initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert('Unable to initialise the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }

  private loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  private initBuffers() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      300, 600,
      600, 600,
      300, 300,
      600, 300,
      
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER,
                       new Float32Array(positions),
                       this.gl.STATIC_DRAW);

    return {
      position: positionBuffer
    };
  }

}
