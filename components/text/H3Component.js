import {Bad_Script, Carter_One, Dancing_Script, Ubuntu_Mono} from 'next/font/google'
const inter = Ubuntu_Mono({ subsets: ['latin'], weight: '400' });
export default function H2Component({children, className}){
    return (
        <h3 className={inter.className + " " + className}>
            {children}
        </h3>
    )
}
