import Head from 'next/head'
import {useEffect, useState} from "react";
import {useRouter} from 'next/router';


// my components
import Nav from "../nav/Nav";
import {HeaderComponent} from "./HeaderComponent";
import {FooterComponent} from "./FooterComponent";

// fonts
import {Manrope, Open_Sans, Ubuntu_Mono} from "next/font/google";
import {ServerService} from "services/ServerService";
import {BreakpointService} from "services/BreakpointService";
import {ResizeService} from "services/ResizeService";
import Link from "next/link";
import H1Component from "@/components/text/H1Component";
// const inter = Manrope({
//     subsets: ['latin']
// });
const inter = Ubuntu_Mono({ subsets: ['latin'], weight: '400' });

export default function Layout({Component, pageProps, children}){

    console.log('Layout')

    const router = useRouter()
    const pages = [
        {
            name: 'Home',
            route: '/',
            active: false,
            title: 'Clipboard Manager | Home',
            keywords: 'home',
            description: 'home',
        },
        {
            name: 'Sign In',
            route: '/signin',
            active: false,
            title: 'Clipboard Manager | Sign In',
            keywords: '',
            description: '',
            requireAuth: false,
        },
        {
            name: 'Create Account',
            route: '/signup',
            active: false,
            title: 'Clipboard Manager | Sign Up',
            keywords: '',
            description: '',
            requireAuth: false,
        },
        {
            name: 'Sign Out',
            route: '/signout',
            active: false,
            title: '',
            keywords: '',
            description: '',
            requireAuth: true,
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
                <link href={"https://site1.admin.meanwebapp.com/themes/flatly.css"} type={"text/css"} />
                {/*trackPageViews*/}
            </Head>

            <HeaderComponent>
                <Nav
                    currentPage={currentPage}
                    pages={pages}
                    navClick={handleNavClick} />
            </HeaderComponent>

            {/*<header className={currentPage.name}>*/}
            {/*    <div className={getHeaderClassName()}>*/}
            {/*        <div className={"row"}>*/}
            {/*            <div className={"col col-lg-4"}>*/}
            {/*                <H1Component>*/}
            {/*                <Link href={"/"}>*/}
            {/*                    Clipboard Manager*/}
            {/*                </Link>*/}
            {/*                </H1Component>*/}
            {/*            </div>*/}
            {/*            <div className={"col col-lg-8"}>*/}
            {/*                */}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</header>*/}

            <main className={inter.className}>
                {children}
            </main>

            <FooterComponent />
        </>
    )
}
