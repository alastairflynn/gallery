import { Component, OnInit, HostListener } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  filesize: string;
  location: any;
  size: number;
  unit: string;

  @HostListener('window:keydown', ['$event']) onKey(event: KeyboardEvent): void {
    if (event.key == "ArrowLeft") {
      this.Next();
    }
    else if (event.key == "ArrowRight") {
      this.Previous();
    }
    if (event.key == "Escape") {
      this.Back();
    }
  }

  constructor(public photoService: PhotoService,
              private geocodingService: GeocodingService) { }

  ngOnInit() {
    this.filesize = this.formatFilesize();
    if (this.photoService.selectedPhoto.lat) {
      this.getLocation();
    }
  }

  formatFilesize(): string {
    this.size = this.photoService.selectedPhoto.filesize / 1024;
    if (this.size >= 1024) {
      this.size /= 1024;
      this.unit = 'MiB';
    }
    else {
      this.unit = 'kiB';
    }
    return `${this.size.toPrecision(2)}${this.unit}`
  }

  getLocation(): void {
    this.geocodingService.Reverse(this.photoService.selectedPhoto.lat, this.photoService.selectedPhoto.lon).subscribe(location => this.location = location);
  }

  Back(): void {
    this.photoService.selectedPhoto = null;
  }

  Next(): void {
    this.photoService.getNextImage(this.photoService.selectedPhoto.id).subscribe(photo => this.photoService.selectedPhoto = photo);
    this.filesize = this.formatFilesize();
    if (this.photoService.selectedPhoto.lat) {
      this.getLocation();
    }
  }

  Previous(): void {
    this.photoService.getPreviousImage(this.photoService.selectedPhoto.id).subscribe(photo => this.photoService.selectedPhoto = photo);
    this.filesize = this.formatFilesize();
    if (this.photoService.selectedPhoto.lat) {
      this.getLocation();
    }
  }
}
