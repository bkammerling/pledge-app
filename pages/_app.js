import { useEffect } from 'react'
import '../styles/customBootstrap.scss'
import '../styles/globals.scss'

import { storyblokInit, apiPlugin } from "@storyblok/react";
import Column from "../components/Column";
import Grid from "../components/Grid";
import Hero from "../components/Hero";
import Page from "../components/Page";
import Feature from '../components/Feature';
import Pledge from '../components/Pledge';

const components = {
  column: Column,
  grid: Grid,
  hero: Hero,
  page: Page,
  feature: Feature,
  pledge: Pledge,
};

storyblokInit({
  accessToken: process.env.storyblokApiToken,
  use: [apiPlugin],
  components,
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    //import('bootstrap/dist/js/bootstrap')
  }, [])

  return <Component {...pageProps} />;
}

export default MyApp;
