import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: any = {
    features: [], //we should initialize the features array because we use push() method in onFeatureToggle()
    contact: {}
  };


  constructor(
    private route: ActivatedRoute, // to read route parameters
    private router: Router, // to navigate the user to another different page if they pass an invalid Id
    private vehicleService: VehicleService) {
    this.route.params.subscribe(p => {
      this.vehicle.id = +p['id']; // '+' is for convert to number
    })
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehicle.id)
      .subscribe(v => {
        this.vehicle = v;
      },
        err => {
          if (err.status == 404)
            this.router.navigate(['/not-found']);
        }
      );

    this.vehicleService.getMakes().subscribe(makes =>
      this.makes = makes);

    this.vehicleService.getFeatures().subscribe(features =>
      this.features = features);
  }

  onMakeChange() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);

    this.models = selectedMake ? selectedMake.models : [];

    delete this.vehicle.modelId;
  }

  onFeatureToggle(featureId, $event) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1); // remove one object from the index
    }
  }

  submit() {
    this.vehicleService.create(this.vehicle)
      .subscribe(x => console.log(x));
  }
}
