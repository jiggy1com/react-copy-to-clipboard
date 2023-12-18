/**
 * TODO: move to server
 * @constructor
 */
export function GlobalMailObject(){
    this.smtpUser = 'kidsfurnituresuperstore@verysecurewebsite.com';
    this.smtpPass = 'Evelyn2023!!';
    this.smtpHost = 'verysecurewebsite.com';
    this.smtpPort = '587';
}

/**
 * TODO: move to server
 * @constructor
 */
export function ClientMailObject(){
    this.url = 'https://www.kidsfurnituresuperstore.us';
    this.companyName = 'Kids Furniture Superstore';
    this.email = 'infokids41@gmail.com';
    this.cc = 'jiggy1com@gmail.com';
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
