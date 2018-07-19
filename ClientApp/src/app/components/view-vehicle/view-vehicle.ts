import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { PhotoService } from '../../services/photo.service';
import { ProgressService } from '../../services/progress.service';



@Component({
    templateUrl: 'view-vehicle.html'
})

export class ViewVehicleComponent implements OnInit {
    @ViewChild('fileInput') fileIput: ElementRef // to make a reference between fileInput variable here and the other [#fileInput] in the template
    vehicle: any;
    vehicleId: number;
    photos: any[];
    progress: any;

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private photoService: PhotoService,
        private progressService: ProgressService,
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
        this.photoService.getPhotos(this.vehicleId)
            .subscribe(photos => this.photos = photos);



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

        this.progressService.startTracking()
            .subscribe(progress => {
                console.log(progress);
                this.zone.run(() => {
                    this.progress = progress;
                })
            },
                null,
                () => { this.progress = null });

        var nativeElement: HTMLInputElement = this.fileIput.nativeElement;
        var file = nativeElement.files[0];
        nativeElement.value = ''; // here we clear the element after we select it in the input field
        this.photoService.upload(this.vehicleId, file) // we deal with single file so we select files array as one element : files[0]
            .subscribe(photo => {
                this.photos.push(photo)
            },
                err => { // here specificaly handling the error
                    alert(err.text());
                });
    }

}









