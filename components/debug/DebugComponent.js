import {BreakpointService} from "services/BreakpointService";
import {useEffect, useState} from "react";
import {debounce} from "@/services/DebounceService";
import {ServerService} from "@/services/ServerService";


export function DebugComponent() {

    const [isReady, setIsReady] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [debugClassList, setDebugClassList] = useState([])

    let breakpointService = new BreakpointService();
    let serverService = new ServerService();

    useEffect(() => {
        setIsReady(true);

        // debugClassList
        if(!serverService.isServerSide()){
            let classList = ['debug'];
            if(!isLocalHost()){
                classList.push('d-none');
            }
            setDebugClassList(classList);
        }

        // resize handler
        setWindowWidth(window.innerWidth)

        const resizeHandler = ()=>{
            setWindowWidth(window.innerWidth)
        }

        let handler = debounce(()=>{
            resizeHandler()
        },250)

        window.addEventListener('resize', handler);
        return ()=> window.removeEventListener('resize', handler);

    }, []);

    function getClassList(){
        return debugClassList.join(" ");
    }

    function hasWindow(){
        return typeof window !== 'undefined';
    }

    function isLocalHost(){
        return hasWindow()
            && window.location.host.indexOf('localhost') !== -1
    }

    return (
        <div id={isReady.toString()} className={getClassList()}>
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
