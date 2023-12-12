import Head from 'next/head'
import {useEffect, useState} from "react";
import {useRouter} from 'next/router';


// my components
import Nav from "../nav/Nav";
import {HeaderComponent} from "./HeaderComponent";
import {FooterComponent} from "./FooterComponent";

// fonts
import {Manrope, Open_Sans} from "next/font/google";
import {ServerService} from "services/ServerService";
import {BreakpointService} from "services/BreakpointService";
import {ResizeService} from "services/ResizeService";
import Link from "next/link";
const inter = Manrope({
    subsets: ['latin']
});

export default function Layout({Component, pageProps, children}){

    console.log('Layout')

    const router = useRouter()
    const pages = [
        {
            name: 'home',
            route: '/',
            active: false,
            title: 'Copy to Clipboard Manager',
            keywords: '',
            description: '',
        }
    ]
    const [currentPage, setCurrentPage] = useState(pages[0]);

    const [randomNumber, setRandomNumber] = useState(0);
    const [currentBreakPoint, setCurrentBreakPoint] = useState('xxl');
    let breakpointService = null;
    let serverService = new ServerService();
    let resizeService = new ResizeService();
    resizeService.setHandler(resizeHandler);

    function resizeHandler(){
        setRandomNumber(Math.random())
    }

    function handleNavClick(obj){
        setCurrentPage(obj);
        pages.forEach((page)=>{
            page.active = obj.name === page.name;
        })
    }

    useEffect(()=>{
        console.log('pages', pages);
        console.log('route', router.pathname);
        pages.forEach((page)=>{
            if(page.route === router.pathname){
                setCurrentPage(page);
            }
        })

        if(!serverService.isServerSide()){
            if(!breakpointService){
                breakpointService = new BreakpointService();
            }
            let bp = breakpointService.getCurrentBreakpointName();
            if(bp !== currentBreakPoint){
                setCurrentBreakPoint(bp);
            }
        }

    }, [randomNumber])

    // const title = 'Bamby Bungalow - ' + currentPage.title;

    function getTitle(){
        return currentPage.title
        // return 'Bamby Bungalow - ' + currentPage.title;
    }

    function getHeaderClassName(){
        let className = 'pt-2 pb-2 ';
        if(currentBreakPoint === 'xs' || currentBreakPoint === 'sm' || currentBreakPoint === 'md'){
            className += 'container-fluid';
        }else{
            className += 'container';
        }
        return className;
    }

    return (
        <>
            <Head>
                <title>{getTitle()}</title>
                <meta charSet="utf-8" />
                <meta name={"keywords"} content={currentPage.keywords} />
                <meta name={"description"} content={currentPage.description} />

                {/*trackPageViews*/}
            </Head>

            <header className={currentPage.name}>

            </header>

            <main className={inter.className}>
                {children}
            </main>
            <FooterComponent />
        </>
    )
}
