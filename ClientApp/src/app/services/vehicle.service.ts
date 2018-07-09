import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from '../models/vehicle';
@Injectable()
export class VehicleService {

  private readonly vehicleEndpoint = '/api/vehicles';

  constructor(private http: Http) { }

  getMakes() {
    return this.http.get('/api/makes')
      .map(res => res.json());

  }
  getFeatures() {
    return this.http.get('/api/features')
      .map(res => res.json());
  }

  create(vehicle) {
    return this.http.post(this.vehicleEndpoint, vehicle)
      .map(res => res.json());
  }

  getVehicle(id) {
    return this.http.get(this.vehicleEndpoint + '/' + id)
      .map(res => res.json());
  }

  getVehicles() {
    return this.http.get(this.vehicleEndpoint)
      .map(res => res.json());

  }

  update(vehicle: SaveVehicle) {
    return this.http.put(this.vehicleEndpoint + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id) {
    return this.http.delete(this.vehicleEndpoint + id)
      .map(res => res.json());
  }

}
