import { storyblokEditable, StoryblokComponent } from "@storyblok/react";

const Hero = ({ blok }) => {
  return (
    <section className="hero" {...storyblokEditable(blok)}>
     <div className="px-4 pt-5 my-5 text-center border-bottom">
      <h1 className="display-4 fw-bold">{ blok.title }</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">{ blok.subtitle }</p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
          <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Primary button</button>
        </div>
      </div>
      <div className="overflow-hidden" style={{maxHeight: '30vh'}}>
        <div className="container px-5">  
          <img
            className={'img-fluid border rounded-3 shadow-lg mb-4'}
            src={`${blok.image.filename}/m/1400x0`}
            alt={blok.image.alt}
            width={700}
            height={500}
          />
        </div>
      </div>
    </div>

    </section>
  );
};

export default Hero;
