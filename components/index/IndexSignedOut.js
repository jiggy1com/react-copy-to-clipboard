import Link from "next/link";
import {FaPlus} from "react-icons/fa6";

export function IndexSignedOut({addBoard}){
    return (
        <>

            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Welcome to the Clipboard Manager</h1>
                    <p className="col-md-8 fs-4">Do you find yourself having to copy and paste things often?
                        And use different types of media to store your data, or simply can't find it?</p>
                    <p className="col-md-8 fs-4">The Clipboard Manager was developed to help alleviate that stress by centralizing and
                        organizing your frequent copy and paste needs.</p>
                    <button className="btn btn-primary btn-lg"
                            onClick={addBoard}
                            type="button">Get Started Free
                    </button>
                    <Link className={"btn btn-success btn-lg m-3"}
                          href={"/signup"}>Create Free Account
                    </Link>
                </div>
            </div>

            <div className={"alert alert-info"}>

                <h4>How to Use</h4>

                <p>Start by clicking <button className={"btn btn-primary mb-3"}
                                             onClick={addBoard}>
                    Add New Board
                </button>, then click the <span className={"btn btn-primary"}> <FaPlus/> </span> icon to add a new board item.
                    Need <Link className={"btn btn-primary"} href={"/help"}>
                        More Info
                    </Link>
                </p>

            </div>

        </>
    )
}
