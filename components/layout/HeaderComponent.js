import {Bad_Script, Carter_One, Ubuntu_Mono} from 'next/font/google'
const inter = Ubuntu_Mono({ subsets: ['latin'], weight: '400' });
export function HeaderComponent({children}){
    return (
        <header className={"bg-primary " + inter.className}>
            {children}
            {/*<div className={"container-fluid"}>*/}
            {/*    <div className={"row"}>*/}
            {/*        <div className={"col-12"}>*/}
            {/*            <H1Component>*/}
            {/*                Clipboard Manager H1*/}
            {/*            </H1Component>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </header>
    )
}
