/**
 * TODO: move to server
 * @constructor
 */
export function GlobalMailObject(){
    this.smtpUser = '';
    this.smtpPass = '';
    this.smtpHost = '';
    this.smtpPort = '';
}


/**
 * TODO: move to server
 * @constructor
 */
export function ClientMailObject(){
    this.url = '';
    this.companyName = '';
    this.email = '';
    this.cc = '';
}

/**
 * @deprecated
 */
// export function MailObject () {
//     this.smtpUser = '';
//     this.smtpCC = '';
//     this.smtpPass = '';
//     this.smtpHost = '';
//     this.smtpPort = '';
// }

export class ApiService {

    constructor(res, data){
        this.res = res;
    }

    success(data){
        this.res.status(200).json({
            success: true,
            data: data
        })
    }

    error(err){
        console.log('err', err);
        this.res.status(500).json({
            success: false,
            message: err
        })
    }

}
