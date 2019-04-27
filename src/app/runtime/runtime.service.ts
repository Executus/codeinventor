import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  private isRuntime: boolean
  private gl: WebGLRenderingContext;
  private programInfo;

  constructor() {
    this.isRuntime = false;
    this.gl = null;
  }

  public isRuntimeRunning(): boolean {
    return this.isRuntime;
  }

  public startRuntime(): void {
    this.isRuntime = true;
  }

  public stopRuntime(): void {
    this.isRuntime = false;
  }

  public setGlContext(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  public getGlContext(): WebGLRenderingContext {
    return this.gl;
  }

  public setShaderProgramInfo(programInfo): void {
    this.programInfo = programInfo;
  }

  public getShaderProgramInfo() {
    return this.programInfo;
  }
}
