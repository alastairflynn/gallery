import { Component, OnInit } from '@angular/core';
import { Photo, Path } from '../photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  paths: Path[];

  constructor(public photoService: PhotoService) { }

  ngOnInit() {
    this.getPaths();
  }

  getPaths(): void {
    this.photoService.getPaths().subscribe(paths => this.paths = paths);
  }

  addPath(path: string): void {
    this.photoService.addPath(path).subscribe(image_path => this.paths.push(image_path));
  }

  refreshAll(): void {
    this.photoService.refreshAll().subscribe();
  }

  refreshPath(path: Path): void {
    this.photoService.refreshPath(path).subscribe();
  }

  removeAll(): void {
    this.photoService.removeAll().subscribe();
  }

  removePath(path: Path): void {
    this.photoService.removePath(path).subscribe();
    this.paths = this.paths.filter(p => p !== path);
  }

  Back(): void {
    this.photoService.importView = false;
  }
}
