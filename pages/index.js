import Head from "next/head";

import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

export default function Home({ story = null, linksData = null }) {
  story = useStoryblokState(story);

  return (
    <>
      <Head>
        <title>Fund for Global Human Rights Pledge Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StoryblokComponent blok={story.content} />
      
      <div className="container col-xxl-8 px-4">
      { Object.values(linksData).map((linkKey) => {
        if (linkKey.is_folder || linkKey.slug === "home") {
          return;
        }
        
        return (
          <p>
            <a href={linkKey.real_path}>{linkKey.name}</a>
          </p>
        )
      })}
      </div>

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
  let linksData  = await storyblokApi.get("cdn/links/");

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
      linksData: linksData ? linksData.data.links : false,
    }
  };
}
