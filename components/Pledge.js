import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { render } from 'storyblok-rich-text-react-renderer';

const Pledge = ({ blok, ipDeets, tag }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    optin: ""
  });
  const [state, setState] = useState('idle');
  const [signees, setSignees] = useState(7142);

  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source') || "";
  const utmCampaign = searchParams.get('utm_campaign') || "";


  const signPledge = async (e) => {  
    e.preventDefault();
    setState('Loading')
    
    
    try {
      await fetch("/api/signPetition", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, tag, ipDeets }), 
      })
      .then(response => response.json())  // convert to json
      .then(json => {
        console.log(json)
        setState('Success')
        setSignees(signees+1);
      })    
      .catch(err => { 
        console.log('Request Failed', err)
        setState('Error')
      }); 
      
      
      
    } catch(e) {
      console.log(e);
    }
    setState('Success')
    /*
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        console.log('in signpledge not ok', response);
        setState('Error')
        // DO SOMETHING IF THERE'S AN ERROR
      } else {
        setState('Success')
        setSignees(signees+1);
      }
      */
    
    // ERROR HANDLING HERE! 400 - email not good, 400 - email already signed

  }
  
  return (
    <section className="section pledge">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-7 mb-9 mb-lg-0">
            {/* Heading and Image */}
            <div className="mb-5">
              <h1 className="h2">{blok.title}</h1>
              {blok.image && 
              <img 
                src={`${blok.image.filename}/m/800x450/smart`}
                srcSet={`${blok.image.filename}/m/400x225/smart 400w,
                         ${blok.image.filename}/m/600x338/smart 900w,
                         ${blok.image.filename}/m/800x450/smart 1200w
                        `}
                sizes="(max-width: 767px) 100%, 680px"
                className="img-fluid my-3"
              />
              }
              { render(blok.content) }
            </div>
            {/* End Heading */}
          </div>
          <div className="col-md-5">
            {/* Card */}
            <div className="card">
              <div className="card-body">
                <div className="progress bg-primary p-1">
                  <div className="progress-bar bg-dark" role="progressbar" style={{width: '75%'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                </div>
                <h3 className="card-header-title mb-0 mt-2 h1">{signees}</h3>
                <h5 className="card-header-title mb-4">Help us get to 10,000</h5>
                <hr></hr>
                <p><strong>I pledge to fight for human rights. Add my name:</strong></p>
                {/* Form */}
                <form onSubmit={signPledge}> 
                  <div style={{ display: 'none' }}>
                    <input id="mce-LSOURCE" name="LSOURCE" type="hidden" value={utmSource} data-ref="utm_source" />
                    <input id="mce-LCAMPAIGN" name="LCAMPAIGN" type="hidden" value={utmCampaign} data-ref="utm_campaign" />
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text" onChange={(e) => setFormData({...formData, fname: e.target.value})} value={formData.fname} className="form-control" id="fnameInput" placeholder="First name" />
                    <label htmlFor="fnameInput">First name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text"onChange={(e) => setFormData({...formData, lname: e.target.value})} value={formData.lname} className="form-control" id="lnameInput" placeholder="Last name" />
                    <label htmlFor="lnameInput">Last name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} className="form-control" id="emailInput" placeholder="name@example.com" required />
                    <label htmlFor="emailInput">Email address</label>
                    <div className="invalid-feedback">Email address has already signed pledge</div>
                  </div>
                  <div>
                    <p className="form-text mb-2">We are depending on people like you to stand up for what's right! Can we email you occasionally with important campaign updates?</p>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="optin" id="optinYes" value="yes" onChange={(e) => setFormData({...formData, optin: e.target.value})} required />
                      <label className="form-check-label" htmlFor="optinYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="optin" id="optinNo" value="no" onChange={(e) => setFormData({...formData, optin: e.target.value})}  />
                      <label className="form-check-label" htmlFor="optinNo">
                        No
                      </label>
                    </div>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg mb-2 fw-bold" 
                      disabled={state === 'Loading'}
                      >
                        Add my name
                    </button>
                  </div>
                  
                  <p className="form-text">View the Fund for Global Human Right's privacy policy.</p>
                  
                </form>
                {/* End Form */}
              </div>
              {/* End Card */}
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Row */}
      </div>
      {/* End Contact Form */}

    </section>
  );
};

export default Pledge;
