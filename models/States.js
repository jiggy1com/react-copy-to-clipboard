export function getStateList(){
    return [
        {selected: false, value: "AK", label: "Alaska"},
        {selected: false, value: "AL", label: "Alabama"},
        {selected: false, value: "AR", label: "Arkansas"},
        {selected: false, value: "AZ", label: "Arizona"},
        {selected: false, value: "CA", label: "California"},
        {selected: false, value: "CO", label: "Colorado"},
        {selected: false, value: "CT", label: "Connecticut"},
        {selected: false, value: "DC", label: "Washington D.C."},
        {selected: false, value: "DE", label: "Delaware"},
        {selected: false, value: "FL", label: "Florida"},
        {selected: false, value: "GA", label: "Georgia"},
        {selected: false, value: "HI", label: "Hawaii"},
        {selected: false, value: "IA", label: "Iowa"},
        {selected: false, value: "ID", label: "Idaho"},
        {selected: false, value: "IL", label: "Illinois"},
        {selected: false, value: "IN", label: "Indiana"},
        {selected: false, value: "KS", label: "Kansas"},
        {selected: false, value: "KY", label: "Kentucky"},
        {selected: false, value: "LA", label: "Louisiana"},
        {selected: false, value: "MA", label: "Massachusetts"},
        {selected: false, value: "MD", label: "Maryland"},
        {selected: false, value: "ME", label: "Maine"},
        {selected: false, value: "MI", label: "Michigan"},
        {selected: false, value: "MN", label: "Minnesota"},
        {selected: false, value: "MO", label: "Missouri"},
        {selected: false, value: "MS", label: "Mississippi"},
        {selected: false, value: "MT", label: "Montana"},
        {selected: false, value: "NC", label: "North Carolina"},
        {selected: false, value: "ND", label: "North Dakota"},
        {selected: false, value: "NE", label: "Nebraska"},
        {selected: false, value: "NH", label: "New Hampshire"},
        {selected: false, value: "NJ", label: "New Jersey"},
        {selected: false, value: "NM", label: "New Mexico"},
        {selected: false, value: "NV", label: "Nevada"},
        {selected: false, value: "NY", label: "New York"},
        {selected: false, value: "OH", label: "Ohio"},
        {selected: false, value: "OK", label: "Oklahoma"},
        {selected: false, value: "OR", label: "Oregon"},
        {selected: false, value: "PA", label: "Pennsylvania"},
        {selected: false, value: "RI", label: "Rhode Island"},
        {selected: false, value: "SC", label: "South Carolina"},
        {selected: false, value: "SD", label: "South Dakota"},
        {selected: false, value: "TN", label: "Tennessee"},
        {selected: false, value: "TX", label: "Texas"},
        {selected: false, value: "UT", label: "Utah"},
        {selected: false, value: "VA", label: "Virginia"},
        {selected: false, value: "VT", label: "Vermont"},
        {selected: false, value: "WA", label: "Washington"},
        {selected: false, value: "WI", label: "Wisconsin"},
        {selected: false, value: "WV", label: "West Virginia"},
        {selected: false, value: "WY", label: "Wyoming"},
    ];
}

export function getStateListWithEmptyFirstOption(selectedValue){
    let stateList = getStateList();
    stateList.splice(0,0, {
        selected: false,
        value: '',
        label: '-- State --'
    })

    stateList.forEach((stateListItem)=>{
        stateListItem.selected = stateListItem.value === selectedValue;
    })

    return stateList;
}
