import {Bad_Script, Carter_One} from 'next/font/google'
import H1Component from "@/components/text/H1Component";
// const inter = Carter_One({ subsets: ['latin'], weight: '400' })
const inter = Bad_Script({ subsets: ['latin'], weight: '400' })
export function HeaderComponent(){
    return (
        <header className={inter.className}>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <H1Component>Clipboard Manager</H1Component>
                    </div>
                </div>
            </div>
        </header>
    )
}
