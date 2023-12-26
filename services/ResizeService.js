// TODO: add debounce

import {ServerService} from "services/ServerService";
import {debounce} from "services/DebounceService";

export class ResizeService {
    constructor(handler) {
        this.serverService = new ServerService();
        this.handler = handler ?? function(){};
        if(this.handler){
            this.bindResize();
        }
    }

    bindResize(){
        if(!this.serverService.isServerSide()){
            window.addEventListener('resize', debounce(()=>{
                this.onResize.bind(this)()
            },250));
        }
    }

    setHandler(func){
        this.handler = func;
        this.bindResize()
        return this;
    }

    onResize(){
        if(this.handler){
            debounce(this.handler)();
        }
    }

    forceInvoke(){
        console.log('forceInvoke')
        this.handler()
    }

}
