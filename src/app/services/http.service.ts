import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private hostname: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public Get(url: string): Observable<any> {
    return this.http.get(this.hostname + url);
  }

  public Post(url: string, body: any): Observable<any> {
    return this.http.post(this.hostname + url, body);
  }

  public Put(url: string, body: any): Observable<any> {
    return this.http.put(this.hostname + url, body);
  }

  public Delete(url: string): Observable<any> {
    return this.http.delete(this.hostname + url);
  }
}
