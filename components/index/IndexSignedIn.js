import Link from "next/link";
import {FaClipboardList} from "react-icons/fa6";

export function IndexSignedIn(){
    return (
        <>

            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Welcome back to the <FaClipboardList /> Clipboard Manager</h1>
                    <p className="col-md-8 fs-4">Let us know if there's anything we can do for you.</p>

                </div>
            </div>

        </>
    )
}
