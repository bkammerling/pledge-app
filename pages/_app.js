import { useEffect } from 'react'
import '../styles/customBootstrap.scss'
import '../styles/globals.scss'

import "../lib/storyblok";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    //import('bootstrap/dist/js/bootstrap')
  }, [])

  return <Component {...pageProps} />;
}

export default MyApp;
