import {UserService} from "@/services/UserService";

export default function Todo(){
    return (
        <>
            <div className={"container-fluid mt-5 mb-5"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <div className={"card mb-3"}>
                <div className={"card-header"}>
                    Features TODO:
                </div>
                <div className={"card-body"}>
                    <ul>
                        <li>update board item <s>from text to object (as originally intended, oops!)</s>
                            <ul>
                                <li><s>item type default: text</s></li>
                                <li>allow item type to be textarea</li>
                                <li>auto scale textarea to maximum, default X rows</li>
                                <li>allow user to set maximum / no maximum</li>
                            </ul>
                        </li>
                        <li>encrypt stored data, decrypt when returning
                            <ul>
                                <li>use a different encryption salt than used for account passwords</li>
                            </ul>
                        </li>
                        <li>add error handlers throughout application</li>
                        <li><s>auto update local storage if board item is text, to be an object before breaking the site</s></li>
                        <li>load board data server side instead of client side (when user signed in)</li>
                        <li>?</li>
                    </ul>
                </div>
            </div>
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
