import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: any = {};

  constructor() { }

  public loadScript(name: string, src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (this.scripts[name] && this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      } else {
        if (!this.scripts[name]) {
          this.scripts[name] = {
            loaded: false
          }
        }
        
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
        };
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
