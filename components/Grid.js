import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Grid = ({ blok }) => {
  return (
    <section className="section grid">
      <div className="container">

        <div className="row" {...storyblokEditable(blok)}>
          {blok.columns.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Grid;
