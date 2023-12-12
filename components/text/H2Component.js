import {Bad_Script, Carter_One, Dancing_Script} from 'next/font/google'
const inter = Dancing_Script({ subsets: ['latin'], weight: '400' })
export default function H2Component({children, className}){
    return (
        <h2 className={inter.className + " " + className}>
            {children}
        </h2>
    )
}
