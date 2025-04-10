import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingOverlayService } from '../genericComponents/loading-overlay/loading-overlay.service';

@Injectable()
export class HttpService implements HttpInterceptor{

  constructor(
    private loadingOverlayService: LoadingOverlayService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingOverlayService.show();

    return next.handle(req).pipe(
      finalize(() => this.loadingOverlayService.hide())
    );
  }

}
