import {useEffect, useState} from "react";
import {ShareDynamic} from "@/components/share/ShareDynamic";
export function ModalComponent({children, title, closeText="Close", saveText=""}) {

    return (
        <>
            <div id={"modal"} className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {title}
                            </h5>

                            <div className={"btn-close"}
                                 data-bs-dismiss="modal"
                                 aria-label="Close">
                                <ShareDynamic icon={"FaXmark"} />
                            </div>

                        {/*    <button type="button"*/}
                        {/*            className="btn-close"*/}
                        {/*            data-bs-dismiss="modal"*/}
                        {/*            aria-label="Close"></button>*/}
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">

                            <button type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal">
                                {closeText}
                            </button>

                            {saveText &&
                                <button type="button"
                                        className="btn btn-primary">
                                    {saveText}
                                </button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
