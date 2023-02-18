import { storyblokEditable } from "@storyblok/react";
import { render } from 'storyblok-rich-text-react-renderer';

const Feature = ({ blok }) => {
  return (
    <div className="feature container col-xxl-8 px-4 py-5" {...storyblokEditable(blok)}>
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div className="col-10 col-sm-8 col-lg-6">
          <img
            className={'d-block mx-lg-auto img-fluid'}
            src={`${blok.image.filename}/m/1400x0`}
            alt={blok.image.alt}
            width={700}
            height={500}
          />
        </div>
        <div className="col-lg-6">
          <h1 className="display-6 fw-bold lh-1 mb-3">{ blok.title }</h1>
          <p>{ render(blok.text) } </p>
        </div>
      </div>
    </div>
  );
};
  
export default Feature;
  
