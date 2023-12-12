import {Bad_Script, Carter_One, Dancing_Script} from 'next/font/google'
const inter = Dancing_Script({ subsets: ['latin'], weight: '400' })
export default function H1Component({children, className}){
    return (
        <h1 className={inter.className + " " + className + " border-bottom"}>
            {children}
        </h1>
    )
}
