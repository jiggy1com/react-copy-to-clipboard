import {FaSpinner} from "react-icons/fa6";
import {useEffect, useState} from "react";

export function LoadingComponent({isLoading}){

    const [localIsLoading, setLocalIsLoading] = useState(false);

    useEffect(()=>{
       if(isLoading !== localIsLoading){
           setLocalIsLoading(isLoading);
       }
    }, ['isLoading'])

    function renderLoading(){
        if(isLoading){
            return (
                <div className={"loading"}>
                    <FaSpinner className={"spin"} />
                </div>
            )
        }else{
            return (
                <></>
            )
        }
    }

    return (
        <>
            {renderLoading()}
        </>
    )
}
