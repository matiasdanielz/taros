import { Component } from '@angular/core';
import { LoadingOverlayService } from './loading-overlay.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.css']
})
export class LoadingOverlayComponent {
  protected loading$ = this.loadingOverlayService.loading$;

  constructor(
    private loadingOverlayService: LoadingOverlayService
  ) {}
}
