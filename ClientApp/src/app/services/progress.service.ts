import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {

    uploadProgress: Subject<any> = new Subject(); //[derived from Observable class] in Subject class we can push a new value to that Observable
    downloadProgress: Subject<any> = new Subject();
}


//we need to access XMLHttpRequest and in Angular internaly use this class inside a class called : BrowserXhr



@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {

    constructor(private service: ProgressService) {
        super();
    }

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build(); // XMLHttpRequest object that build in base class

        // track the download progress
        xhr.onprogress = (event) => {
            this.service.downloadProgress.next(this.createProgress(event))
        };

        // track the upload progress
        xhr.upload.onprogress = (event) => {
            this.service.uploadProgress.next(this.createProgress(event))
        };

        return xhr;
    }

    private createProgress(event) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}