import {UserService} from "@/services/UserService";
import {FetchService} from "@/services/FetchService";
import Board from "@/components/copyPaste/Board";
import {CopyPasteService} from "@/services/CopyPasteService";
import {useEffect, useState} from "react";
import Cookies from "cookies";
import {USERID} from "@/services/AppService";


export default function BoardIndex({_id, cookieUserId, boardData, isLoggedIn}){

    const service = new CopyPasteService(isLoggedIn);
    const [board, setBoard] = useState(boardData)
    // const [boards, setBoards] = useState([]);

    useEffect(()=>{

    }, [])

    function notifyParent(){
        console.log('notifyParent')
        loadBoards()
    }

    function loadBoards(){
        getBoard({_id, cookieUserId}).then((resp)=>{
            console.log('loadBoards:resp', resp)
            setBoard(resp.data[0])
        })
    }

    function renderBoards() {
        if (!board) {
            return (
                <div className={"col-12"}>
                    Are you sure you're logged in?
                </div>
            )
        } else {
            return (
                <Board
                    isSingleBoard={true}
                    isLoggedIn={isLoggedIn}
                    notifyParent={notifyParent}
                    loadBoards={loadBoards}
                    boardIdx={0}
                    boardId={board._id}
                    board={board}/>
            )
        }
    }

    return (
        <div className={"container-fluid mb-5"}>
            <div className={"row"}>
                <div className={"col-12"}>

                    <div className={"row"}>
                        {renderBoards()}
                    </div>

                </div>
            </div>
        </div>
    )
}


function getBoard({urlPrefix='', _id, cookieUserId}){
    let f = new FetchService()
    let url = urlPrefix + '/api/readboard'
    let data = {_id, cookieUserId}
    return f.doPost(url, data).then((res)=>{
        return res
    })
}


export async function getServerSideProps(context){

    let headers = context.req.headers;
    let userService = new UserService(context.req);
    let cookieUserId = Cookies(context.req).get(USERID)

    let requestData = {
        urlPrefix: `${headers['x-forwarded-proto']}://${headers.host}`,
        _id: context.params._id,
        cookieUserId: cookieUserId,
    }

    let responseData = null

    await getBoard(requestData).then((res)=>{
        console.log('API RES', res)
        responseData = res.data
    })

    return {
        props:{
            isLoggedIn: userService.isLoggedIn(),
            _id: context.params._id,
            cookieUserId: requestData?.cookieUserId ?? null,
            boardData: responseData && responseData.length
                ? responseData[0]
                : null
        }
    }

}
