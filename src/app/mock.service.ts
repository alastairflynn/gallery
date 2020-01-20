import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Photo, Path } from './photo';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  selectedPhoto: Photo;
  importView: boolean = false;

  private photos: Photo[] = [/*{
    id: 10,
    src: 'assets/images/12/07/IMG_20190707_121557.jpg',
    thumb: 'assets/images/thumbs/121.webp',
    belongs_to: 12,
    date: '2019-07-07T12:15:57+00:00',
    width: 4000,
    height: 3000,
    lat: 56.08533447222222,
    lon: -5.548347416666666,
    name: 'IMG_20190707_121557.jpg',
    filesize: 7724437,
    camera_make: 'Xiaomi',
    camera_model: 'Mi A2 Lite',
    f_value: 2.2,
    exposure: 837,
    focal_length: 3.82,
    iso: 100
  }, */{
    id: 437,
    src: 'assets/images/24/DSCN0442.JPG',
    thumb: 'assets/images/thumbs/24/437.webp',
    belongs_to: 24,
    date: '2019-01-19T13:44:25+00:00',
    width: 4320,
    height: 3240,
    lat: null,
    lon: null,
    name: 'DSCN0442.JPG',
    filesize: 0,
    camera_make: 'NIKON',
    camera_model: 'COOLPIX S3100',
    f_value: 8.0,
    exposure: 400,
    focal_length: 4.6,
    iso: 80
  }];
  private paths: Path[] = [{ path:'/home/alastair/Pictures/2019/01', id:24 }];

  constructor() { }

  getPhoto (): Photo {
    return this.selectedPhoto;
  }

  getAllImages (): Observable<Photo[]> {
    return of(this.photos)
  }

  getImage (id: number): Observable<Photo> {
    return of(this.photos[0])
  }

  getNextImage (id: number): Observable<Photo> {
    return of(this.photos[0])
  }

  getPreviousImage (id: number): Observable<Photo> {
    return of(this.photos[0])
  }

  getPaths (): Observable<Path[]> {
    return of(this.paths)
  }

  addPath (path: string): Observable<Path> {
    return of({ path:path, id:0 })
  }

  refreshAll (): Observable<Path> {
    return of({ path:'', id:0 })
  }

  refreshPath (path: Path): Observable<Path> {
    return of(path)
  }

  removeAll (): Observable<Path> {
    return of({ path:'', id:0 })
  }

  removePath (path: Path): Observable<Path> {
    return of(path)
  }
}

