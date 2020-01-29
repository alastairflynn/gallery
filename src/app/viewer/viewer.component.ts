import { Component, OnInit, HostListener } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../mock.service';
import { GeocodingService } from '../geocoding.service';
import * as Leaflet from 'leaflet';
// declare let Leaflet;

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
  dragging: boolean = false;
  x: number = 0;
  y: number = 0;
  mouseX: number;
  mouseY: number;
  width: number;
  height: number;
  initialWidth: number;
  initialHeight: number;
  map: any;

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

  @HostListener('window:wheel', ['$event']) onWheelScroll(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.zoomIn(event);
    }
    else {
      this.zoomOut(event);
    }
  }

  constructor(public photoService: PhotoService,
              private geocodingService: GeocodingService) { }

  ngOnInit() {
    this.filesize = this.formatFilesize();
    if (this.photoService.selectedPhoto.lat) {
      this.getLocation();
    }

    this.initialWidth = document.getElementById('dragElement').offsetWidth;
    this.initialHeight = document.getElementById('dragElement').offsetHeight;
    this.width = this.initialWidth;
    this.height = this.initialHeight;
  }

  drag(event: any): void {
    event.preventDefault();
    if ( this.dragging ) {
      this.x += event.clientX - this.mouseX;
      this.y += event.clientY - this.mouseY;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    }
  }

  startDrag(event: any): void {
    event.preventDefault();
    this.dragging = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  stopDrag(event: any): void {
    event.preventDefault();
    this.dragging = false;
  }

  zoomIn(event: any): void {
    event.preventDefault();
    this.x -= (event.clientX - 200 - this.x)*0.1;
    this.y -= (event.clientY - this.y)*0.1;
    this.width *= 1.1;
    this.height *= 1.1;
  }

  zoomOut(event: any): void {
    event.preventDefault();
    this.x += (event.clientX - 200 - this.x)/11;
    this.y += (event.clientY - this.y)/11;
    this.width /= 1.1;
    this.height /= 1.1;
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
    this.geocodingService.Reverse(this.photoService.selectedPhoto.lat, this.photoService.selectedPhoto.lon).subscribe(location => this.processLocation(location));
  }

  processLocation(location: any): void {
    this.location = location;
    this.map = Leaflet.map('map').fitBounds([[location.boundingbox[0], location.boundingbox[2]], [location.boundingbox[1], location.boundingbox[3]]]);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    Leaflet.marker([location.lat, location.lon]).addTo(this.map);
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
    this.width = this.initialWidth;
    this.height = this.initialHeight;
    this.x = 0;
    this.y = 0;
  }

  Previous(): void {
    this.photoService.getPreviousImage(this.photoService.selectedPhoto.id).subscribe(photo => this.photoService.selectedPhoto = photo);
    this.filesize = this.formatFilesize();
    if (this.photoService.selectedPhoto.lat) {
      this.getLocation();
    }
    this.width = this.initialWidth;
    this.height = this.initialHeight;
    this.x = 0;
    this.y = 0;
  }
}
