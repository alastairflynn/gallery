import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo, Path } from './photo';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  private backend = '/api';
  selectedPhoto: Photo;
  importView: boolean = false;

  constructor(private http: HttpClient) { }

  getAllImages (): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.backend}/thumbs/`)
  }

  getImage (id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.backend}/image/${id}`)
  }

  getNextImage (id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.backend}/image/${id}/next`)
  }

  getPreviousImage (id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.backend}/image/${id}/previous`)
  }

  getPaths (): Observable<Path[]> {
    return this.http.get<Path[]>(`${this.backend}/paths/`)
  }

  addPath (path: string): Observable<Path> {
    return this.http.post<Path>(`${this.backend}/import/`, path);
  }

  refreshAll (): Observable<Path> {
    return this.http.put<Path>(`${this.backend}/refresh/`, null);
  }

  refreshPath (path: Path): Observable<Path> {
    return this.http.put<Path>(`${this.backend}/path/${path.id}/refresh/`, null);
  }

  removeAll (): Observable<Path> {
    return this.http.delete<Path>(`${this.backend}/remove/`);
  }

  removePath (path: Path): Observable<Path> {
    return this.http.delete<Path>(`${this.backend}/path/${path.id}/remove`);
  }
}
