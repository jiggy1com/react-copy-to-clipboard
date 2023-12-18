import {FetchService, getDefaultOptions} from "services/FetchService";

const http = new FetchService()

function getUrl(local=false){
    return local
        ? '/api/forward' // local requests

        // Changing local=false to be local, hope it doesn't break
        : '/api/forward'; // https://www.domain.com/api
}

function makeRequest(url, data = {}, options = {}){

}

// in order to export async functions
// you must define them first,
// then you can export them in module.exports (see below)
// but for some reason this does not work on nextjs
async function getParams({local = false}){
    let url = getUrl(local);
    url += '?action=getParams';
    return http.doGet(url, {}, {
        mode: 'cors'
    }).then((res)=>{
        console.log('SharedApiService:getParams:res', res);
        if(local){

        }else{

        }
        return res
    }).catch((err)=>{
        // console.log('SharedApiService:getParams:err', err);
        return err;
    });
}

async function getProductsByPageId({pageId, currentPage, searchFor = '', local = false}){
    // console.log('getProductsByPageId:arguments',arguments);
    let searchTerm = searchFor.replaceAll(' ', '+');
    let url = getUrl(local);

    url += '?action=getProductsByPageId' ;
    url += '&currentPage=' + currentPage
    if(pageId){
        url += '&pageId=' + pageId;
    }
    if(searchTerm){
        url += '&searchFor=' + searchTerm;
    }

    return http.doGet(url, {}, {
        mode: 'cors',
    }).then((res)=>{
        console.log('SharedApiService:getProductsByPageId:res', local, res);
        return res;
    }).catch((err)=>{
        // console.log('SharedApiService:getProductsByPageId:err', err);
        return err;
    });
}

async function getPageCategoriesByPageId({local=false, pageId=0}){
    let url = getUrl(local);
    url += `?action=getPageCategoriesByPageId&pageId=${pageId}`;
    console.log('url', url);
    return http.doGet(url, {}, {
        mode: 'cors'
    }).then((res)=>{
        // console.log('SharedApiService:getParams:res', res);
        if(local){

        }else{

        }
        return res
    }).catch((err)=>{
        // console.log('SharedApiService:getParams:err', err);
        return err;
    });
}

async function getProductById({local = false, productId = 0}){
    let url = getUrl(local);
    url += `?action=getProductById&productId=${productId}`;
    return http.doGet(url, {}, {
        mode: 'cors'
    }).then((res)=>{
        console.log('SharedApiService:getProductById:res', res);
        return res
    }).catch((err)=>{
        console.log('SharedApiService:getProductById:err', err);
        return err;
    });
}

async function getProductImagesByProductId({local = false, productId = 0}){
    let url = getUrl(local);
    url += `?action=getProductImagesByProductId&productId=${productId}`;
    return http.doGet(url, {}, {
        mode: 'cors'
    }).then((res)=>{
        console.log('SharedApiService:getProductImagesByProductId:res', res);
        return res
    }).catch((err)=>{
        console.log('SharedApiService:getProductImagesByProductId:err', err);
        return {
            data: []
        };
    });
}

async function getRelatedProducts({local=false, items=""}){
    if(items.length){
        let url = getUrl(local);
        url += `?action=getRelatedProductByRelatedItems&items=${items}`;
        return http.doGet(url, {}, {
            mode: 'cors'
        }).then((res)=>{
            console.log('SharedApiService:getRelatedProducts:res', res);
            return res
        }).catch((err)=>{
            console.log('SharedApiService:getRelatedProducts:err', err);
            return {
                data: []
            };
        });
    }else{
        return {
            data: []
        };
    }

}

module.exports = {
    getParams,
    getProductsByPageId,
    getPageCategoriesByPageId,
    getProductById,
    getProductImagesByProductId,
    getRelatedProducts,
}
