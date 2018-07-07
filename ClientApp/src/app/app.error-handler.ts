import { ErrorHandler, NgZone, Inject, Injector } from "@angular/core";

export class AppErrorHandler implements ErrorHandler {

    constructor(@Inject(NgZone) private ngZone: NgZone) {

    }

    handleError(error: any): void {
        this.ngZone.run(() => {
            console.log("ERROR : this should be notification inside ngZone");
        });


    }

}