import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private backend = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) { }

  Reverse (lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.backend}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14`)
  }
}
