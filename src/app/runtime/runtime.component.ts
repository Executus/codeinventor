import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObjectService } from '../services/object.service';
import { Object } from '../classes/object';
import { RuntimeService }  from './runtime.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html',
  styleUrls: ['./runtime.component..scss']
})
export class RuntimeComponent implements OnInit, OnDestroy {

  private gl: WebGLRenderingContext;
  private programInfo;
  private sceneTree: Object[] = [];
  private intervalId;
  private currentTime;

  private vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texcoord;
    uniform vec2 u_resolution;
    varying vec2 v_texcoord;

    void main() {
      // convert from pixels to 0.0 -> 1.0
      vec2 zeroToOne = a_position / u_resolution;

      // convert from 0 -> 1 to 0 -> 2
      vec2 zeroToTwo = zeroToOne * 2.0;

      // convert from 0 -> 2 to -1 -> +1
      vec2 clipSpace = zeroToTwo -  1.0;

      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      v_texcoord = a_texcoord;
    }
  `;

  private fsSource = `
    precision mediump float;

    varying vec2 v_texcoord;
    uniform sampler2D u_texture;

    void main() {
      //gl_FragColor = vec4(1, 1, 1, 1);
      gl_FragColor = texture2D(u_texture, v_texcoord);
      gl_FragColor.rgb *= gl_FragColor.a;
    }
  `;

  constructor(private objectService: ObjectService, private runtimeService: RuntimeService) {}

  ngOnInit() {
    let canvas: HTMLCanvasElement = document.querySelector('#glCanvas');
    this.gl = canvas.getContext('webgl', {
      alpha: false
    });

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
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'a_position'),
        texcoordPosition: this.gl.getAttribLocation(shaderProgram, 'a_texcoord')
      },
      uniformLocations: {
        resolutionPosition: this.gl.getUniformLocation(shaderProgram, 'u_resolution'),
        texturePosition: this.gl.getUniformLocation(shaderProgram, 'u_texture')
      }
    }

    this.runtimeService.setGlContext(this.gl);
    this.runtimeService.setShaderProgramInfo(this.programInfo);

    this.gl.useProgram(this.programInfo.program);

    this.initScene().then(() => {
      this.initInput();
      this.currentTime = performance.now();

      this.intervalId = setInterval(function(context) {
        context.mainLoop();
      }, 20, this);
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.sceneTree = [];
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    this.programInfo = null;
    this.gl = null;
  }

  private mainLoop() {
    if (this.runtimeService.isRuntimeRunning()) {
      let newTime = performance.now();
      let deltaTime = newTime - this.currentTime;
      this.currentTime = newTime;

      this.updateScene(deltaTime);
      this.drawScene();
    }
  }

  private keyDownHandler(ev) {
    let key = ev.key || ev.keyCode;

    let keyboardListeners = this.runtimeService.getKeyboardListeners();
    keyboardListeners.forEach(obj => {
      obj.onKeyDown(key);
    })
  }

  private keyUpHandler(ev) {
    let key = ev.key || ev.keyCode;

    let keyboardListeners = this.runtimeService.getKeyboardListeners();
    keyboardListeners.forEach(obj => {
      obj.onKeyUp(key);
    })
  }

  private initInput() {
    let self = this;
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  private initScene(): Promise<any> {
    let promise: Promise<any> = this.objectService.updateObjectTreeData(false);
    promise.then(() => {
      let objectTree = this.objectService.getObjectTreeData();
      if (objectTree) {
        // deep copy the tree
        this.sceneTree = cloneDeep(objectTree);
  
        for (let i = 0; i < this.sceneTree.length; i++) {
          this.sceneTree[i].init(this.runtimeService, this.objectService);
        }
      }
    });
    return promise;
  }

  private updateScene(deltaTime) {
    if (this.sceneTree) {
      for (let i = 0; i < this.sceneTree.length; i++) {
        this.sceneTree[i].update(deltaTime, this.runtimeService);
      }
    }
  }

  private drawScene() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

    if (this.sceneTree) {
      for (let i = 0; i < this.sceneTree.length; i++) {
        this.sceneTree[i].draw(this.runtimeService);
      }
    }
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
}
