import { storyblokInit, apiPlugin } from "@storyblok/react";

import Column from "../components/Column";
import Grid from "../components/Grid";
import Hero from "../components/Hero";
import Page from "../components/Page";
import Feature from "../components/Feature";
import Pledge from "../components/Pledge";

const components = {
  column: Column,
  grid: Grid,
  hero: Hero,
  page: Page,
  feature: Feature,
  pledge: Pledge,
};

storyblokInit({
  accessToken:
    process.env.STORYBLOK_API_TOKEN ||
    process.env.NEXT_PUBLIC_STORYBLOK_API_TOKEN,
  use: [apiPlugin],
  components,
});
