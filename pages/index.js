import Head from "next/head";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Home({ story = null }) {
  story = useStoryblokState(story);

  return (
    <>
      <Head>
        <title>Fund for Global Human Rights Pledge Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StoryblokComponent blok={story.content} />
    </>
  );
}

export async function getStaticProps(context) {
  let slug = "home";
  let params = context.params || {};

  if (context.preview) {
    params.version = "draft"
    params.cv = Date.now()
  }

  const storyblokApi = getStoryblokApi();
  let { data } = await storyblokApi.get(`cdn/stories/${slug}`, params);

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
    }
  };
}
