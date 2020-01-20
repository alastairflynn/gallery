export class Photo {
  id: number;
  src: string;
  belongs_to: number;
  thumb: string;
  date: string;
  width: number;
  height: number;
  lat: number;
  lon: number;
  name: string;
  filesize: number;
  camera_make: string;
  camera_model: string;
  f_value: number;
  exposure: number;
  focal_length: number;
  iso: number;
}

export class Path {
  id: number;
  path: string;
}

export class DayDivider {
  num: number;
  photos: Photo[];
  location: string;
}

export class MonthDivider {
  num: number;
  days: DayDivider[];
  linksVisible: boolean;
}

export class YearDivider {
  num: number;
  months: MonthDivider[];
  linksVisible: boolean;
}
