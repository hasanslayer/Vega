import * as Raven from 'raven-js';

import { ErrorHandler, NgZone, Inject, isDevMode } from "@angular/core";

export class AppErrorHandler implements ErrorHandler {

    constructor(@Inject(NgZone) private ngZone: NgZone) {

    }

    handleError(error: any): void {

        if (!isDevMode())
            Raven.captureException(error.originalError || error);
        else
            throw error;

        this.ngZone.run(() => {
            console.log("ERROR : this should be notification inside ngZone");
        });


    }

}