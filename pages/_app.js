// layout
import {useEffect} from "react";
import Layout from "../components/layout/Layout";
// import { cookies } from 'next/headers'

// google analytics
import {GoogleAnalytics, usePageViews} from "nextjs-google-analytics";

// css
import 'styles/scss.scss';
import 'styles/bootstrap.css';
import '@fortawesome/fontawesome-free';
import '@fortawesome/free-brands-svg-icons';
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core'
import {config} from '@fortawesome/fontawesome-svg-core'
import {DebugComponent} from "components/debug/DebugComponent";

config.autoAddCss = true

export default function MyApp({
                                  Component,
                                  pageProps
                              }) {
    const gaMeasurementId = ''; //'G-FF567X3N80';
    const getLayout = Component.getLayout || MyApp.getDefaultLayout;

    // usePageViews()

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");

    }, []);

    return getLayout(
        <>

            {/*<GoogleAnalytics strategy="lazyOnload"*/}
            {/*                 trackPageViews*/}
            {/*                 gaMeasurementId={gaMeasurementId}/>*/}
            <Component {...pageProps}/>
            <DebugComponent />
        </>
    )
}

MyApp.getDefaultLayout = function getDefaultLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }
