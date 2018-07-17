import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PhotoService {

    constructor(private http: Http) { }

    upload(vehicleId, photo) {
        var formData = new FormData();
        formData.append('file',photo)// 'file' as string is the Exact name in PhotosController [Upload(int vehicleId, IFormFile ->'file')]
        return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData)
            .map(res => res.json());
    }
}