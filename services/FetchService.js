// import {headers, cookies} from "next/headers";
// import { serialize } from 'cookie'
function FetchOptions(options){
    this.method = options.method ?? 'POST';
    this.mode = options.mode ?? 'cors'; // no-cors, *cors, same-origin
    this.cache = options.cache ?? 'no-cache'; // *default, no-cache, reload, force-cache, only-if-cached
    // this.credentials = options.credentials ?? 'same-origin'; // include, *same-origin, omit
    this.credentials = options.credentials ?? 'include';
    this.headers = extendHeaders(
        {
            'Content-Type': 'application/json',
        },
        options.headers ?? {}
    )

    //     options.headers ?? {
    //     'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    // }

    // this.redirect = options.redirect ?? 'follow'; // manual, *follow, error
    // this.referrerPolicy = options. referrerPolicy ?? 'no-referrer'; // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    this.body = JSON.stringify(options.body); // body data type must match "Content-Type" header

    if(this.method === 'GET'){
        delete this.body;
    }

    function extendHeaders(defaults, overrides){
        Object.keys(overrides).forEach((key)=>{
            defaults[key] = overrides[key];
        })
        return defaults;
    }

}

// used for client side code
export function getDefaultOptions(){
    return {
        mode: 'cors'
    }
}

export class FetchService {

    constructor() {

    }

    // setup custom headers

    setHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    setHeaders(headers = {}) {
        Object.keys(headers).forEach((key) => {
            if (!this.headers.hasOwnProperty(key)) {
                this.headers[key] = headers[key];
            }
        })
        return this;
    }

    overrideHeaders(headers = {}) {
        Object.keys(headers).forEach((key) => {
            this.headers[key] = headers[key];
        });
        return this;
    }

    // perform http requests

    async _fetch(url = '', data = {} || null, options = {}) {

        options.body = data;

        let opt = new FetchOptions(options);

        // if(url.indexOf('http') === -1){
        //     url = '<client domain>' + url;
        // }

        return await fetch(url, opt).then((res) => {
            // ensure cookies are returned to caller
            const clone = res.clone();
            const j = clone.json();
            return j.then((idk)=>{
                j.headers = new Headers(j.headers);
                idk.__cookies__ = [];
                res.headers.getSetCookie().forEach((cookie)=>{
                    cookie = cookie.replaceAll(';HTTPOnly', ';')
                    idk.__cookies__.push(cookie);
                    j.headers.append('Set-Cookie', cookie);
                })
                return j;
            })
        }).then((res) => {
            return this.response(res, res.success ?? false);
        }).catch((err) => {
            return this.response(null, false, err);
        });
    }

    async doPost(url = '', data = {}, options = {}) {
        options.method = 'POST';
        return await this._fetch(url, data, options);
    }

    async doGet(url = '', data = {}, options = {}) {
        options.method = 'GET';
        return await this._fetch(url, null, options);
    }

    // normalize response
    response(res = [], success = true, message = '') {

        // console.log('FetchService:response', res);

        if (!Array.isArray(res?.data)
            && typeof res === "object" && res) {
            res.data = [res.data] ?? []
        }
        return {
            success: success,
            message: res?.message ? res.message
                : message !== '' ? message
                : null, // !success ? message : null,
            data: success ? (res.data) : null,
            // dsn: res.dsn,
            // request_cookies: res.request_cookies ?? [],
            // cookies: res.__cookies__ ?? [],
            // records: success ? res.length : null,
            // totalRecords: 0 // res.totalRecords
        }
    }

}
