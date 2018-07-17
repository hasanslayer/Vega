import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { PhotoService } from '../../services/photo.service';



@Component({
    templateUrl: 'view-vehicle.html'
})

export class ViewVehicleComponent implements OnInit {
    @ViewChild('fileInput') fileIput: ElementRef // to make a reference between fileInput variable here and the other [#fileInput] in the template
    vehicle: any;
    vehicleId: number;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private photoService: PhotoService,
        private vehicleService: VehicleService) {

        this.route.params.subscribe(p => {
            this.vehicleId = +p['id'];
            if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
                router.navigate(['/vehicles']);
                return;
            }
        });
    }

    ngOnInit() {
        this.vehicleService.getVehicle(this.vehicleId)
            .subscribe(
                v => this.vehicle = v,
                err => {
                    if (err.status == 404) {
                        this.router.navigate(['/not-found']);
                        return;
                    }
                }
            )
    }

    delete() {
        if (confirm("Are you sure?")) {
            this.vehicleService.delete(this.vehicle.id)
                .subscribe(x => {
                    this.router.navigate(['/vehicles'])
                });
        }
    }

    uploadPhoto() {
        var nativeElement: HTMLInputElement = this.fileIput.nativeElement;

        this.photoService.upload(this.vehicleId, nativeElement.files[0]) // we deal with single file so we select files array as one element : files[0]
            .subscribe(x => console.log(x));
    }

}









