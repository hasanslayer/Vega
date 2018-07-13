import { VehicleService } from './../../services/vehicle.service';
import { Vehicle, KeyValuePair } from './../../models/vehicle';
import { Component, OnInit } from "@angular/core";




@Component({
    templateUrl: 'vehicle-list.html'
})

export class VehicleListComponent implements OnInit {
    private readonly PAGE_SIZE = 3;


    queryResult: any = {};
    makes: KeyValuePair[];
    query: any = {
        pageSize: this.PAGE_SIZE
    };
    columns = [
        { title: 'Id' },
        { title: 'Contact Name', key: 'contactName', isSortable: true },
        { title: 'Make', key: 'make', isSortable: true },
        { title: 'Model', key: 'model', isSortable: true },
        {}//here is the link of vehicle in the template

    ];

    constructor(private vehicleService: VehicleService) { }

    ngOnInit() {
        this.vehicleService.getMakes()
            .subscribe(makes => this.makes = makes);


        // we remove this.allVehicles because the filtering will be on the server
        this.populateVehicles();
    }

    private populateVehicles() {
        this.vehicleService.getVehicles(this.query)
            .subscribe(result => this.queryResult = result);
    }

    onFilterChange() {
        //this.filter.modelId = 2; // this is for demonstrating
        this.query.page = 1; //reset
        this.populateVehicles();
    }

    resetFilter() {
        this.query = {
            page: 1,
            pageSize: this.PAGE_SIZE
        };
        this.populateVehicles();
    }

    sortBy(columnName) {
        if (this.query.sortBy === columnName) {
            this.query.isSortAscending = !this.query.isSortAscending;
        } else {
            this.query.sortBy = columnName;
            this.query.isSortAscending = true;
        }
        this.populateVehicles();

    }
    onPageChange(page) {
        this.query.page = page;
        this.populateVehicles();
    }
}