import {FaCopy, FaSave} from "react-icons/fa";
import {FaEye, FaPlus, FaUpRightFromSquare, FaX} from "react-icons/fa6";
import {UserService} from "@/services/UserService";
import Link from "next/link";

export default function Help (){

    return (
        <>
            <div className={"container-fluid mt-5 mb-5"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <div className={"alert alert-info"}>

                            <h4>Legend</h4>
                            <div className={"row"}>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaSave/>
                                 </span> - Saves your board title or board item<br/>
                                </div>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaPlus/>
                                 </span> - Adds new board item<br/>
                                </div>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaX/>
                                 </span> - Delete board or board item<br/>
                                </div>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaEye/>
                                 </span> - Toggle visibility of text<br/>
                                </div>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaCopy/>
                                 </span> - Copy text to clipboard <br/>
                                </div>
                                <div className={"col-12 col-md-4 mb-3"}>
                                 <span className={"btn btn-primary"}>
                                   <FaUpRightFromSquare/>
                                 </span> - Open link in new tab/window<br/>
                                </div>
                            </div>
                        </div>

                        <div className={"alert alert-info"}>

                            Data is saved to localStorage until you create an account.<br/>
                            Sign into your account to retrieve your clipboard manager.<br/>
                            To copy a value to your clipboard, click the copy button.<br/>
                            Data is NOT currently encrypted, so please do not store passwords or other sensitive information
                            until further notice.
                        </div>

                        <Link href={"/"} className={"btn btn-primary"}>
                            OK, I'm ready!
                        </Link>

                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({req}) {

    let userService = new UserService(req);

    return {
        props: {
            defaultBoards: [],
            isLoggedIn: userService.isLoggedIn()
        }
    }
}
