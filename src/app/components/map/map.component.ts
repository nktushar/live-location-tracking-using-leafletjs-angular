import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: { [key: string]: L.Marker } = {};

  lat = 51.505;
  lng = -0.09;

  constructor(private firebaseService: FirebaseService) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.listenForLocationUpdates();
  }

  private initializeMap(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private listenForLocationUpdates(): void {
    console.log('Listening for location updates');
    if (!this.markers['device1']) {
      this.markers['device1'] = L.marker([this.lat, this.lng]).addTo(this.map);
    } else {
      this.markers['device1'].setLatLng([this.lat, this.lng]);
    }

    this.firebaseService.listenForLocations((locations) => {
      for (const [deviceId, location] of Object.entries(locations || {})) {
        const { lat, lng } = location as { lat: number; lng: number };
        console.log('Location update:', deviceId, lat, lng);

        if (this.markers[deviceId]) {
          this.markers[deviceId].setLatLng([lat, lng]);
        } else {
          this.markers[deviceId] = L.marker([lat, lng]).addTo(this.map);
        }
      }
    });
  }
}
