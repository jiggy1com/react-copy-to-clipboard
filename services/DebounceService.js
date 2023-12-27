export function debounce(callback, timeout = 250){
    let timer;
    return (...args) => {
        // console.log('clearTimeout')
        clearTimeout(timer);
        timer = setTimeout(()=>{
            // console.log('debounce ran', timeout)
            callback.apply(null, args);
        }, timeout);
    }
}
