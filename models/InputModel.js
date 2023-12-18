import {getStateList, getStateListWithEmptyFirstOption} from "./States";

const DefaultValidation = function(){
    return {
        success: true,
        message: ''
    };
}

const DefaultRadioOptions = [
    {
        id: 'unique',
        name: 'shared',
        value: 'unique',
        label: 'unique'
    }
]

const DefaultCheckboxOptions = [
    {
        id: 'unique',
        name: 'shared',
        value: 'unique',
        label: 'unique'
    }
]


function CapitalizeFirstChar(str){
    let first = str.charAt(0).toUpperCase();
    let remaining = str.substring(1);
    return first + remaining
}
export function GenericFormModel(config){

    if(typeof config.id === 'undefined'){
        console.error('GenericInputModel config error. ID is a required property.');
    }

    return {
        id: config.id,
        placeholder: config.placeholder ?? CapitalizeFirstChar(config.id) ?? '',
        label: config.label ?? '',
        name: config.name ?? config.id,
        // value: config.value ?? '', // initial default value
        defaultValue: config.defaultValue ?? '', // initial default value (react)
        type: config.type ?? 'text',
        validation: config.validation ?? DefaultValidation, // TODO: implement validation rules
        options: config.options ?? null,
        onChangeCallback: config.onChangeCallback ?? function(){

        },
        colClass: config.colClass ?? 'col-12 col-md-6',
    }
}

export function GenericRadioFormOptionModel(config){
    return {
        id: config.id ?? CapitalizeFirstChar(config.id) ?? '',
        name: config.name ?? config.id,
        label: config.label ?? '',
        value: config.value ?? '',
        checked: config.checked ?? false,
        defaultChecked: config.defaultChecked ?? false
    }
}

export function TextFormModel(config){
    return new GenericFormModel(config);
}

export function EmailFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'email';
    return ret;
}

export function PasswordFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'password';
    return ret;
}

export function HiddenFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'hidden';
    return ret;
}

export function TextAreaFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'textarea';
    return ret;
}

export function SelectFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'select';
    return ret;
}

export function RadioFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'radio';
    ret.options = config.options;

    return ret;
}

export function RadioFormOptionModel(config){
    return new GenericRadioFormOptionModel(config);
}

export function CheckboxFormModel(config){
    let ret = new GenericFormModel(config);
    ret.type = 'checkbox';
    ret.options = config.options;
    return ret;
}

function getMonthAsString(month){
    let monthList = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return monthList[month];
}

function getMonthWithTwoDigits(month){
    if(month < 10){
        month = '0' + month;
    }
    return month;
}

export function getExpirationMonthListWithEmptyFirstOption(){
    let list = getExpirationMonthList();
    list.splice(0,0, {
        selected: false,
        value: '',
        label: '-- Exp Month --'
    })
    return list;
}
export function getExpirationMonthList(){
    let date = new Date();
    let ret = [];
    for(let i = 0; i<12; i++){
        date.setMonth(i);
        let obj = {
            selected: false,
            label: getMonthAsString(i) + ' ' + getMonthWithTwoDigits(i+1),
            value: getMonthWithTwoDigits(i+1)
        }
        ret.push(obj);
    }
    return ret;
}

export function getExpirationYearListWithEmptyFirstOption(){
    let list = getExpirationYearList();
    list.splice(0,0, {
        selected: false,
        value: '',
        label: '-- Exp Year --'
    })
    return list;
}

export function getExpirationYearList(){
    let date = new Date();
    let ret = [];
    for(let i=0; i<10; i++){
        let obj = {
            selected: false,
            label: date.getFullYear().toString(),
            value: date.getFullYear().toString(),
        }
        ret.push(obj);
        date.setFullYear(date.getFullYear()+1);
    }
    return ret;
}

export function getCountryList(){
    return [{
        selected: 'false',
        label: 'US',
        value: 'US'
    }];
}

export function getCountryListWithEmptyFirstOption(selectedValue){
    let list = getCountryList();
    list.splice(0,0, {
        selected: false,
        value: '',
        label: '-- Country --'
    })

    list.forEach((listItem)=>{
        listItem.selected = listItem.value === selectedValue;
    });

    return list;
}
