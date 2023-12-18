var conn = require('./conn');
var bluebird = require('bluebird');
var nodemailer = require('nodemailer');
// var util = require('util');

function MailObject(obj){

    // req (required)
    this.req 		= obj.req || '';

    // message (required)
    this.to 		= obj.to || '';
    this.from 		= obj.from || '';
    this.cc 		= obj.cc || '';
    this.bcc 		= obj.bcc || '';
    this.subject 	= obj.subject || '';
    this.text 		= obj.text || '';
    this.html 		= obj.html || '';
    this.attachments = obj.attachments || [];

    // credentials (will set these later in the send() method)
    this.mailhost 	= '';
    this.port 		= '';
    this.username 	= '';
    this.password 	= '';
    this.useSecure 	= '';
}

var setCredentials = function(mailObject, resolve, reject){
    conn.getDatabaseConnections(mailObject.req).then(function(db){
        var mailsettings = db.models['mailsettings'];
        var promise = mailsettings.findOne({}).exec();

        promise.then(function(doc){
            if(doc){
                return doc;
            }else{
                throw new Error('Mail settings not found. Did you configure your Mail Settings?');
            }
        }).then(function(doc){

            mailObject.mailServerHost 			= doc.mailServerHost;
            mailObject.mailServerPort 			= doc.mailServerPort;
            mailObject.mailServerSenderName 	= doc.mailServerSenderName;
            mailObject.mailServerUsername 		= doc.mailServerUsername;
            mailObject.mailServerPassword 		= doc.mailServerPassword;
            mailObject.mailServerUseSecure 		= doc.mailServerUseSecure;

            resolve(mailObject);

        }).catch(function(err){
            reject(err);
        });
    });

};

var send = function(mailObject, resolve, reject){

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"' + mailObject.mailServerSenderName + '" <' + mailObject.mailServerUsername + '>', // sender address
        to: mailObject.to, // list of receivers
        cc: mailObject.cc || '',
        bcc: mailObject.bcc || '',
        subject: mailObject.subject, // Subject line
        text: mailObject.text, // plain text body
        html: mailObject.html, // html body
        attachments : mailObject.attachments || []
    };

    // create reusable transporter object using the default SMTP transport

    var transporter = nodemailer.createTransport({
        host: mailObject.mailServerHost,
        port: mailObject.mailServerPort,
        secure: mailObject.mailServerUseSecure, // secure:true for port 465, secure:false for port 587
        auth: {
            user: mailObject.mailServerUsername,
            pass: mailObject.mailServerPassword
        }
    });

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            reject(err);
        }else{
            var returnThis = {
                messageId : info.messageId,
                response : info.response
            };
            resolve(returnThis);
        }
    });

};

var testCredentials = function(mailObject, resolve, reject){

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"' + mailObject.mailServerSenderName + '" <' + mailObject.mailServerUsername + '>', // sender address
        to: mailObject.mailServerUsername, // list of receivers
        subject: mailObject.subject, // Subject line
        text: mailObject.text, // plain text body
        html: mailObject.html // html body
    };

    // create reusable transporter object using the default SMTP transport


    var transporter = nodemailer.createTransport(mailObject
        // {
        // 	host: mailObject.mailServerHost,
        // 	port: mailObject.mailServerPort,
        // 	secure: mailObject.mailServerUseSecure, // secure:true for port 465, secure:false for port 587
        // 	auth: {
        // 		user: mailObject.mailServerUsername,
        // 		pass: mailObject.mailServerPassword
        // 	}
        // }
    );

    transporter.verify(function(err, success) {
        if (err) {
            reject(err);
        } else {
            resolve(success);
        }
    });
};

var validateMailObject = function(mailObject, resolve, reject){

    var oValid = {
        isValid : true,
        message : ''
    };

    var setFalse = function(msg){
        oValid.isValid = false;
        oValid.message = msg;
    };

    if( oValid.isValid && typeof mailObject.req !== 'object'){
        setFalse( 'REQUEST OBJECT is a required object key.');
    }

    if( oValid.isValid){
        if(Array.isArray(mailObject.to)){
            if(mailObject.to.length === 0){
                setFalse( "TO is a required object key. If it's an array, there must be at least 1 item.");
            }
        }else{
            if(mailObject.to === ''){
                setFalse( 'TO is a required object key.');
            }
        }
    }

    if( oValid.isValid && mailObject.from === ''){
        setFalse( 'FROM is a required object key.');
    }

    if( oValid.isValid && mailObject.subject === ''){
        setFalse( 'SUBJECT is a required object key.');
    }

    // TODO: UNCOMMENT AND FIX
    // if( oValid.isValid && mailObject.text === ''){
    // 	setFalse( 'TEXT is a required object key.');
    // }

    if( oValid.isValid && mailObject.html === ''){
        setFalse( 'HTML is a required object key.');
    }

    if(oValid.isValid){
        resolve();
    }else{
        reject(oValid);
    }

};

//
// SENDING MAIL AND VALIDATING CREDENTIALS
//

exports.sendMail = function(mailObject, resolve, reject){

    // construct message
    var oMail = new MailObject(mailObject);
    console.log('oMail', oMail);

    // setup validation
    var isValid = new bluebird(function(resolve, reject){
        validateMailObject(oMail, resolve, reject);
    });

    // isValid promise

    isValid.then(function(){

        // get user sending credentials

        var p = new bluebird(function(resolve, reject){
            setCredentials(oMail, resolve, reject);
        });

        return p.then(function(updatedMailObject){
            return updatedMailObject;
        }).catch(function(err){
            throw new Error(err);
        });

    }).then(function(doc){

        // send message

        var p = new bluebird(function(resolve, reject){
            send(oMail, resolve, reject);
        });

        return p.then(function(mailServerResponse){
            return mailServerResponse;
        }).catch(function(err){
            throw new Error(err);
        });

    }).then(function(mailServerResponse){
        resolve(mailServerResponse);
    }).catch(function(err){
        reject(err);
    });

};

exports.canConnect = function(oMessage, resolve, reject){

    var p = new bluebird(function(resolve, reject){
        testCredentials(oMessage, resolve, reject);
    });

    p.then(function(){
        resolve();
    }).catch(function(err){
        reject(err);
    });

};

//
// HELPERS TO GET EMAIL ADDRESSES
//

exports.getSiteContactEmailBySite = function(site, resolve, reject){

    var oReq = {
        app : {
            nodeApp : {
                dsn : site
            }
        }
    };

    conn.getDatabaseConnections(oReq).then(function(db){
        var ci = db.models['contactinformation'];
        var p = ci.findOne().exec();
        p.then(function(doc){
            resolve(doc.email);
        }).catch(function(err){
            reject(err);
        });
    });

};

exports.getSiteContactEmailBySiteId = function(){

};

exports.getPlrContactEmailBySite = function(){

};

exports.getPlrContactEmailBySiteId = function(){

};


//
// EMAIL TEMPLATES
//


// template helper
var replaceTemplateParams = function(template, params){

    // template = text or html
    // params = {} with keys to update

    var tpl = template;
    for(key in params){
        // console.log('param key', key);
        if(params.hasOwnProperty(key)){
            var regex = new RegExp('{' + key.toUpperCase() + '}', 'gi'); // gi ... i = case insensitive so {companyName} or {companyname} or {COMPANYNAME} will be fine, and preferred to minimize errors/issues
            tpl = tpl.replace(regex, params[key]);
        }
    }
    return tpl;

};

// new user account template

exports.getNewUserAccountTemplate = function(params){

    // params = {
    // 		companyName
    // 		email
    // 		password
    // 		host
    // }

    var template = {

        subject : "Your {COMPANYNAME} account has been created!",

        text : 	"" +
            "Your account for {COMPANYNAME} at {HOST} has been created.\n\n"+
            "You may use the following credentials.\n\n"+
            "Email: {EMAIL}\n\n" +
            "Password: {PASSWORD}\n\n" +
            "You must log in and change your password.",

        html : ''+
            'Your account for {COMPANYNAME} at <a href="http://{HOST}">http://{HOST}</a> has been created.' +
            '<br><br>You may use the following credentials:' +
            '<br><br>'+
            'Email: {EMAIL}' +
            '<br>' +
            'Password: {PASSWORD}' +
            '<br><br>'+
            'You must log in and change your password.'
    };

    return {
        subject : replaceTemplateParams(template.subject, params),
        text : replaceTemplateParams(template.text, params),
        html : replaceTemplateParams(template.html, params)
    };

};

// invoice template

// order template

// forgot password template
exports.getForgotPasswordTemplate = function(params) {

    // params = {
    // 	email
    // 	companyName
    // 	host
    // 	password
    // }

    var template = {
        subject : "Your {COMPANYNAME} Password Has Been Reset",
        text : "Your password has been reset to: {PASSWORD} You will need to login at {HOST}, then update your password.",
        html : '' +
            'Your password has been reset to: <strong>{PASSWORD}</strong>' +
            '<br><br>' +
            'You will need to login at <a href="http://{HOST}">http://{HOST}</a>, then update your password.'
    };

    return {
        subject : replaceTemplateParams(template.subject, params),
        text : replaceTemplateParams(template.text, params),
        html : replaceTemplateParams(template.html, params)
    };

};

// etc

exports.getContentFormTemplate = function(params){

    console.log('params', params);

    // var params = {
    // 	formFields : [
    // 		{
    // 			label : '',
    // 			value : ''
    // 		}
    // 	],
    // 	subject : '',
    // 	sendTo : ''
    // };

    var text = '';
    var html = "<table style='border: solid 1px; border-collapse: collapse;'>";
    for(var key in params.formData){
        if(params.formData.hasOwnProperty(key)){
            text += params.formData[key].label + ': ' + params.formData[key].value + '\r\n\r\n';
            html += "<tr>";
            html += "<td style='padding: 15px; border: solid 1px; font-weight: bold;'>" + params.formData[key].label + "</td>";
            html += "<td style='padding: 15px; border: solid 1px; font-weight: normal;'>" + params.formData[key].value + "</td>";
            html += "</tr>";
        }
    }
    html += '</table>';

    var template = {
        subject : params.subject,
        text : text,
        html : html
    };

    return {
        subject : template.subject, // replaceTemplateParams(template.subject, params),
        text : template.text, // replaceTemplateParams(template.text, params),
        html : template.html //replaceTemplateParams(template.html, params)
    };
};

// etc










// example on how to properly send mail as a promise

// var oMail = {
// 	req : req,
// 	to : '',
// 	from : '',
// 	subject : '',
// 	text : '',
// 	html : ''
// };
//
// var mailPromise = new bluebird(function(resolve, reject){
// 	SendMailHelper.sendMail( oMail, resolve, reject);
// });
//
// // most likely you'll send an email from inside another promise, so do something like this:
//
// return mailPromise.then(function(){
// 	return true;
// }).catch(function(err){
//
// 	// ignore errors when sending transactional emails
//
// 	// throw a new error when sending test emails to let the user know something is wrong
// 	throw new Error(err);
// });
