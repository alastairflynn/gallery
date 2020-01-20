import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { Photo, DayDivider, MonthDivider, YearDivider } from '../photo';
import { PhotoService } from '../photo.service';
import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.css'],
  animations: [
    trigger('collapse', [
      state('closed', style({transform: 'rotate(0deg)'})),
      state('open', style({transform: 'rotate(90deg)'})),
      transition('closed <=> open', [ animate('50ms ease') ])
    ])
  ]
})

export class TilesComponent implements OnInit {
//   photos: Photo[];
  years: YearDivider[] = [];
  year: YearDivider;
  month: MonthDivider;
  day: DayDivider;
  date: Date;
  p: any;

  constructor(public photoService: PhotoService,
              private geocodingService: GeocodingService) { }

  ngOnInit() {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photoService.getAllImages().subscribe( photos => {
      for ( this.p in photos ) { this.processPhoto(photos[this.p]); }
    });
  }

  processPhoto(photo: Photo): void {
    this.date = new Date(photo.date)
    if ( !this.years.some(y => y.num == this.date.getFullYear()) ) {
      this.years.push({ num:this.date.getFullYear(), months:[], linksVisible:false });
    }

    this.year = this.years.pop();
    if ( !this.year.months.some(m => m.num == this.date.getMonth()) ) {
      this.year.months.push({ num:this.date.getMonth(), days:[], linksVisible:false });
    }

    this.month = this.year.months.pop();
    if ( !this.month.days.some(d => d.num == this.date.getDate()) ) {
      this.month.days.push({ num:this.date.getDate(), location:null, photos:[] });
    }

    this.day = this.month.days.pop();
    this.day.photos.push(photo);
    this.getLocation(photo, this.day);
    this.month.days.push(this.day);
    this.year.months.push(this.month);
    this.years.push(this.year);
  }

  getLocation(photo: Photo, day: DayDivider): void {
    this.geocodingService.Reverse(photo.lat, photo.lon).subscribe(location => this.addLocation(location, day));
  }

  addLocation(location: any, day: DayDivider): void {
    if (day.location == null ) {
      day.location = location.name;
    }
    else if ( day.location.search(location.name) == -1 ) {
      day.location = day.location.concat(' - ' + location.name);
    }
  }

  yearCollapse(year: YearDivider): void {
    year.linksVisible = !year.linksVisible;
  }

  monthCollapse(month: MonthDivider): void {
    month.linksVisible = !month.linksVisible;
  }

  View(photo: Photo): void {
    this.photoService.selectedPhoto = photo;
  }

  ImportView(): void {
    this.photoService.importView = true;
  }
}
