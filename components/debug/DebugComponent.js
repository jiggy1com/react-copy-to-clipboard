import {BreakpointService} from "services/BreakpointService";
import {useEffect, useState} from "react";


export function DebugComponent() {

    const [isReady, setIsReady] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    let breakpointService = new BreakpointService();

    useEffect(() => {
        console.log('Debug:useEffect')
        if (!isReady) {
            if(hasWindow() && isLocalHost()) {
                window.addEventListener('resize', () => {
                    setWindowWidth(window.innerWidth);
                })
                setWindowWidth(window.innerWidth);
                setIsReady(true);
            }
            // }else{
            //     document.querySelector('.debug').remove();
            // }
        }
    }, []);

    function getClassList(){
        console.log('Debug:getClassList')
        let classList = "debug";

        if(hasWindow()){
            if(!isLocalHost()){
                classList += " d-none";
            }
        }else{
            classList += " d-none";
        }
        return classList;
    }

    function hasWindow(){
        return typeof window !== 'undefined';
    }

    function isLocalHost(){
        return hasWindow()
            && window.location.host.indexOf('localhost') !== -1
    }

    return (
        <div className={getClassList()}>
            {isReady && breakpointService &&
                <div>
                    breakpoint: {breakpointService.getCurrentBreakpointName()} <br />
                    min: {breakpointService.getMin(breakpointService.getCurrentBreakpointName())} <br />
                    max: {breakpointService.getMax(breakpointService.getCurrentBreakpointName())} <br />
                    windowWidth: {windowWidth}
                </div>
            }
        </div>
    )
}
