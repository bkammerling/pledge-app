import { render } from 'storyblok-rich-text-react-renderer';

const PledgeShare = ({ innerRef, blok, name }) => {
  
  return (
    <>
      <section className="section pledge-share" ref={innerRef} style={{ backgroundImage: `url(${blok.background_img?.filename}/m/1800x0/smart)` }}>

        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center py-5 vh-100 text-center">
            <div className="card share-card p-3">
              <div className="card-body">
                <h2>{ name }{ name ? " - " : ""}{ blok.share_heading }</h2>
                <div className="mt-3 mb-4">
                  { render(blok.share_text) }
                </div>
                <div className="row justify-content-center">
                  <div className="col-sm-8 col-md-6">                    
                    <div className="d-grid gap-2">
                      <button type="button" className="btn btn-primary">Share to Facebook</button>
                      <button type="button" className="btn btn-primary">Share to X (formerly Twitter)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default PledgeShare;
