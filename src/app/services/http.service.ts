import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private hostname: string = environment.hostname;
  private appId: string = '';

  constructor(private http: HttpClient) { }

  public Get(url: string): Observable<any> {
    return this.http.get(this.hostname + url + '?appid=' + this.appId);
  }

  public Post(url: string, body: any): Observable<any> {
    return this.http.post(this.hostname + url + '?appid=' + this.appId, body);
  }

  public Put(url: string, body: any): Observable<any> {
    return this.http.put(this.hostname + url + '?appid=' + this.appId, body);
  }

  public Delete(url: string): Observable<any> {
    return this.http.delete(this.hostname + url + '?appid=' + this.appId);
  }

  public setAppId(appId: string): void {
    this.appId = appId;
  }

  public getAppId(): string {
    return this.appId;
  }
}
