export function debounce(callback, timeout = 250){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            console.log('debounce ran')
            callback.apply(null, args);
        }, timeout);
    }
}
