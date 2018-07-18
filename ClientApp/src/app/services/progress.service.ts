import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {

    private uploadProgress: Subject<any>; //[derived from Observable class] in Subject class we can push a new value to that Observable

    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress) {
        this.uploadProgress.next(progress);
    }

    endTracking() {
        this.uploadProgress.complete();
    }
}


//we need to access XMLHttpRequest and in Angular internaly use this class inside a class called : BrowserXhr



@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {

    constructor(private service: ProgressService) {
        super();
    }

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build(); // XMLHttpRequest object that build in base class

        // track the upload progress
        xhr.upload.onprogress = (event) => {
            this.service.notify(this.createProgress(event))
        };

        xhr.upload.onloadend = () => { // to free up memory leaks 

            this.service.endTracking();

        }

        return xhr;
    }

    private createProgress(event) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}