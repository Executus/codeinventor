import { Injectable } from '@angular/core';

import * as $ from '../lib/jquery';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: any = {};

  constructor() { }

  public loadScript(name: string, src: string, reload: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (!reload && this.scripts[name] && this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      } else {
        this.scripts[name] = {
          loaded: false
        }

        if (reload) {
          // remove old script from the dom
          $("script[src='" + src + "']").remove();
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
