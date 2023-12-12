import {Bad_Script, Carter_One} from 'next/font/google'
// const inter = Carter_One({ subsets: ['latin'], weight: '400' })
const inter = Bad_Script({ subsets: ['latin'], weight: '400' })
export function HeaderComponent(){
    return (
        <header className={inter.className}>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col-12"}>
                        <h1>Copy to Clipboard Manager</h1>
                    </div>
                </div>
            </div>
        </header>
    )
}
