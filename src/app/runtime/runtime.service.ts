import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  private isRuntime: boolean

  constructor() {
    this.isRuntime = false;
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
}
