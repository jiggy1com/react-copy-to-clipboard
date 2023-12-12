import Link from 'next/link';
import {useEffect, useState} from "react";
import {BreakpointService} from "services/BreakpointService";
import {ServerService} from "services/ServerService";
import {ResizeService} from "services/ResizeService";
function Nav({...pageProps}) {


    const serverService = new ServerService();
    let breakpointService = null;

    const [randomNumber, setRandomNumber] = useState(Math.random());
    const [isOpen, setIsOpen] = useState(false);
    const currentPage = pageProps.currentPage;
    const pages = pageProps.pages;
    const [currentBreakPoint, setCurrentBreakpoint] = useState('xxl');

    const resizeService = new ResizeService();
    resizeService.setHandler(doRandom)

    function doRandom(){
        setRandomNumber(Math.random())
    }

    useEffect(()=>{
        if(!serverService.isServerSide()){
            if(!breakpointService){
                breakpointService = new BreakpointService();
            }
            let bp = breakpointService.getCurrentBreakpointName();
            if(bp !== currentBreakPoint){
                setCurrentBreakpoint(bp);
                // setRandomNumber(Math.random())
            }
        }
    }, [randomNumber]);

    function handleNavClick(obj){
        pageProps.navClick(obj);
        if(isOpen){
            document.querySelector('#js-navbar-toggler').click();
        }
    }

    function getClass(obj){
        if(obj.name === currentPage.name){
            return 'nav-link active';
        }else{
            return 'nav-link';
        }
    }

    function handleNavbarTogglerClick(){
        setIsOpen(!isOpen);
    }

    function getNavbarClassName(){
        return 'navbar navbar-expand-lg'; // navbar-dark bg-primary';
    }

    function getNavbarDivClassName(){
        let ret = 'container-fluid';
        if(currentBreakPoint === 'xs' || currentBreakPoint === 'sm' || currentBreakPoint === 'md'){
            ret += ' navbar-dark bg-primary';
        }
        return ret;
    }

    return (
        <nav className={getNavbarClassName()}>
            <div className={getNavbarDivClassName()}>
                <a className="navbar-brand m-0"
                   href="#">
                </a>
                <button
                    id={"js-navbar-toggler"}
                    onClick={handleNavbarTogglerClick}
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon">
                    </span>
                </button>
                <div className="collapse navbar-collapse pl-3 pb-1"
                     id="navbarNav">
                    <ul className="navbar-nav">
                        {pages.map((page, idx) => {
                            return (
                                <li className="nav-item" key={idx}>
                                    <Link
                                        href={page.route}
                                        onClick={()=> handleNavClick(page)}
                                        className={getClass(page)}
                                        aria-current="page">
                                        {page.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav;
