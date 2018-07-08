import * as _ from 'underscore';
import { Vehicle } from './../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs/Observable';

import 'rxjs/add/Observable/forkJoin';
import { SaveVehicle } from '../../models/vehicle';
@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [], //we should initialize the features array because we use push() method in onFeatureToggle()
    contact: {
      name: '',
      phone: '',
      email: ''
    }
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

    var sources = [
      this.vehicleService.getMakes(), // order no matter because the request will be in parallel data[0]
      this.vehicleService.getFeatures(),//data[1]
    ];

    if (this.vehicle.id) // to make sure when create vehicle
      sources.push(this.vehicleService.getVehicle(this.vehicle.id)) //data[2]

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];
      if (this.vehicle.id) {
        this.setVehicle(data[2]);
        this.populateModels();
      }

    }, err => {
      if (err.status == 404)
        this.router.navigate(['/not-found']);
    });
  }

  private setVehicle(v: Vehicle) { // here we do the mapping 
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id'); /* underscore '_' : used for "mapping" because in source object we have KeyValuePair {id,name} but in target object we only want the number*/
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
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
