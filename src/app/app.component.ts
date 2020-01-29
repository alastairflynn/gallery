import { Component } from '@angular/core';
import { PhotoService } from './mock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'gallery';

  constructor(public photoService: PhotoService) { }
}
