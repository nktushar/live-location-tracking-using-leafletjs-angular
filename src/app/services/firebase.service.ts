import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getDatabase(this.app);

  constructor() {}

  // Method to set location data
  setLocation(deviceId: string, lat: number, lng: number) {
    const locationRef = ref(this.db, 'locations/' + deviceId);
    set(locationRef, { lat, lng });
  }

  // Method to listen for location updates
  listenForLocations(callback: (data: any) => void) {
    console.log('DB', this.db);
    console.log('Environment', environment);

    const locationsRef = ref(this.db, 'locations');
    onValue(locationsRef, (snapshot) => {
      callback(snapshot.val());
    });
  }
}
