import { StoryblokComponent } from "@storyblok/react";
import Navigation from "./global/Navigation";

const Page = ({ blok }) => (
  <>
    <Navigation />
    
    {blok.body.map((nestedBlok) => (
      <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
    ))}

  </>
);

export default Page;
