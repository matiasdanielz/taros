import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;

  public show() {
    this.activeRequests++;
    this.loadingSubject.next(true);
  }

  public hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }
}
