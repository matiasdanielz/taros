import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthSession } from 'src/app/models/authSession/auth-session';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly SESSION_KEY = 'auth-session';

  constructor(private http: HttpClient) { }

  public async DoLogin(loginData: any): Promise<any> {    
    const url: string = `${environment.apiDomain}/login`;

    const response: any = await this.http.post(url, loginData, environment.header).toPromise();

    if (response?.isLogged) {
      const session: AuthSession = {
        isLogged: true,
        sessionInfo: {
          userId: response.sessionInfo.userId,
          name: response.sessionInfo.name
        }
      };

      this.setSession(session);
    }

    return response;
  }

  // Salva a sessão no localStorage
  public setSession(session: AuthSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  // Recupera os dados da sessão
  public getSession(): AuthSession | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Verifica se está logado
  public isLoggedIn(): boolean {
    const session = this.getSession();
    return session?.isLogged ?? false;
  }

  // Faz logout (remove sessão)
  public logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
