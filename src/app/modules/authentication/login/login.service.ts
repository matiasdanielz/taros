import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public async DoLogin(loginData: any): Promise<any[]>{    
    const url: string = `${environment.apiDomain}/login`;

    const response: any = await this.http.post(url, loginData, environment.header).toPromise();
    
    return response;
  }
}
