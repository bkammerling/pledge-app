import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import { render } from 'storyblok-rich-text-react-renderer';
import PledgeDonate from './PledgeDonate';
import PledgeShare from './PledgeShare';

const Pledge = ({ blok, slug, ipDeets, tag }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    optin: blok.show_optin ? "" : "yes"
  });
  const [state, setState] = useState('startup');
  const [signees, setSignees] = useState(0);
  const [target, setTarget] = useState(1000);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const donateRef = useRef();
  const shareRef = useRef();

  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source') || "";
  const utmCampaign = searchParams.get('utm_campaign') || "";
  
  useEffect(() => {
    const getSignees = async () => {
      await fetch("/api/getSignees", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }), 
      })
      .then(response => response.json())  // convert to json
      .then(json => {
        console.log(json)
        let returnedCount = json.signees;
        if(returnedCount < 100) {
          returnedCount = returnedCount+100;
        } else if(returnedCount >= 900 && returnedCount < 2000) {
          setTarget(2500);
        } else if(returnedCount >= 2000 && returnedCount < 4500) {
          setTarget(5000);
        } else {
          setTarget(10000);
        }
        
        setSignees(returnedCount);
        setState('idle');
      })    
      .catch(err => { 
        console.log('Request Failed', err)
        setState('error')
      });   
    }
    getSignees(); 
  }, []);


  const signPledge = async (e) => {  
    e.preventDefault();
    setState('loading')

    
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
        if(json.message == "Email already signed") {
          setState('Already signed')
        } else if(json.message == "Error calling Mailchimp") {
          setState('error')
          setError(json.detail);
        } else {
          setState('success')
          setSignees(signees+1);
          afterSuccessfulSign();
        }
      })    
      .catch(err => { 
        console.log('Request Failed', err)
        setState('error')
      });   
      
    } catch(e) {
      console.log(e);
    }
    
  }

  const afterSuccessfulSign = () => {
    setStep(2);
    /* Send Google Event */
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'pledgeSigned',
    });
  }

  const afterDonate = (didDonate = false) => {
    if(didDonate) {
      setState('donate success');
    }
    setStep(3);
    shareRef.current?.scrollIntoView();
  }

  useEffect(() => {
    if (step == 2) {
      donateRef.current?.scrollIntoView();
    } else if (step == 3) {
      shareRef.current?.scrollIntoView();
    }
  }, [step]);
  
  return (
    <>
      {/* BEGIN STEPS */}
      <div className={`steps ${step >= 2 ? 'show': ''}`}>
        <div className="step-wrapper">
          <span className={`step-icon ${step <= 1 ? 'step-icon-psuedo' : ''}`}>
            {step >= 2 && 
              <Image
                src='/check-solid.svg'
                height={18}
                width={18}
                alt="Orange solid check mark or tick"
              />
            }
          </span>
          <span className="step-label">Pledge</span>
        </div>
        <div className="step-wrapper">
          <span className={`step-icon ${step <= 2 ? 'step-icon-psuedo' : ''}`}>
          {step >= 3 && 
              <Image
                src='/check-solid.svg'
                height={18}
                width={18}
                alt="Orange solid check mark or tick"
              />
            }
          </span>
          <span className="step-label">Donate</span>
        </div>
        <div className="step-wrapper">
          <span className={`step-icon ${step <= 3 ? 'step-icon-psuedo' : ''}`}>
            {step >= 4 && 
              <Image
                src='/check-solid.svg'
                height={18}
                width={18}
                alt="Orange solid check mark or tick"
              />
            }</span>
          <span className="step-label">Share</span>
        </div>
      </div>
      {/* END STEPS */}

      {/* BEGIN PLEDGE */}
      <section className="section pledge min-vh-100 py-4">
        <div className="container mt-4">
          <div className="row">
            {/* Col */}
            <div className="col-md-7 mb-9 mb-lg-0">
              {/* Heading and Image */}
              <div className="mb-4">
                <h1 className="h2">{blok.title}</h1>
                {blok.image && 
                  <img 
                  src={`${blok.image.filename}/m/1600x900/smart`}
                  srcSet={`${blok.image.filename}/m/400x225/smart 400w,
                            ${blok.image.filename}/m/800x450/smart 800w,
                            ${blok.image.filename}/m/1200x660/smart 1200w
                          `}
                  sizes="(min-width: 992px) 60vw, (min-width: 768px) 400px, (min-width: 576px) 520px, 95vw"
                  className="img-fluid my-3"
                  onClick={afterSuccessfulSign}
                  />
                }
                { render(blok.content) }
              </div>
              {/* End Heading */}
            </div>
            {/* End Col */}
            {/* Col */}
            <div className="col-md-5">
              
              <div className="card">
                <div className="card-body">
                  <div className="progress bg-primary p-1">
                    <div className="progress-bar bg-dark" role="progressbar" style={{width: `${(signees / target) * 100}%` }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                  <h3 className={`card-header-title mb-0 mt-2 h1 text-transition ${state == 'startup' ? 'text-white' : ''}`}>{signees.toLocaleString()}</h3>
                  <h5 className="card-header-title mb-4">Help us get to <span className={`text-transition ${state == 'startup' ? 'text-white' : ''}`}>{target.toLocaleString()}</span></h5>
                  <hr></hr>
                  <p><strong>{ blok.form_intro }</strong></p>
                  {/* Form */}
                  <form onSubmit={signPledge} > 
                    <div style={{ display: 'none' }}>
                      <input id="mce-LSOURCE" name="LSOURCE" type="hidden" value={utmSource} data-ref="utm_source" />
                      <input id="mce-LCAMPAIGN" name="LCAMPAIGN" type="hidden" value={utmCampaign} data-ref="utm_campaign" />
                    </div>
                    <div className="form-floating mb-3">
                      <input type="text" 
                        onChange={(e) => setFormData({...formData, fname: e.target.value})} 
                        value={formData.fname} 
                        className="form-control" 
                        id="fnameInput" 
                        placeholder="First name" 
                        autoComplete="given-name"  
                        required />
                      <label htmlFor="fnameInput">First name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="text"
                        onChange={(e) => setFormData({...formData, lname: e.target.value})} 
                        value={formData.lname} 
                        className="form-control" 
                        id="lnameInput" 
                        placeholder="Last name" 
                        autoComplete="family-name"  
                        required />
                      <label htmlFor="lnameInput">Last name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="email" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        value={formData.email} 
                        className={`form-control ${state == 'Already signed' ? 'is-invalid' : ''}`}
                        id="emailInput" 
                        placeholder="name@example.com" 
                        autoComplete="email" 
                        required />
                      <label htmlFor="emailInput">Email address</label>
                      <div className="invalid-feedback">Email address has already signed pledge</div>
                    </div>
                    { blok.show_optin ? 
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
                      : null
                    }
                    { state == "error" ?
                        <div className="d-block mt-3 invalid-feedback">Apologies, we had an issue. Please help us and <a target="_blank" href={`mailto:bkammerling@globalhumanrights.org?subject=Pledge%20page%20issue&body=There%20was%20an%20issue%20signing%20the%20pledge. ${encodeURI(error)}`}>report it</a> or you can try again later. <span id="error-text">{error}</span></div>
                        : null
                      }
                    <div className="d-grid gap-2 mt-3">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg mb-2 fw-bold" 
                        disabled={state === 'loading'}>
                          <span className={`${state === 'loading' ? 'd-none' : 'd-inline-block'}`}>Add my name</span>
                          <div className={`spinner-border spinner-border-sm ${state === 'loading' ? 'd-inline-block' : 'd-none'}`} aria-hidden="true">
                            <span role="status" className="visually-hidden">Loading...</span>
                          </div>
                      </button>

                    </div>
                    <div className={`valid-feedback mb-2 ${state == 'success' ? 'd-block' : ''}`}>Signed successfully!</div>
                    
                    <p className="form-text mt-3"><a target="_blank" className="text-muted" href="https://globalhumanrights.org/privacy-policy/">View the Fund for Global Human Right's privacy policy.</a></p>
                    
                  </form>
        
                </div>
              </div>
            </div>
            {/* End Col */}
          </div>
        </div>
      {/* END PLEDGE */}
      </section>
      { (step >= 2 || searchParams.get("_storyblok_c")) ?
        <PledgeDonate innerRef={donateRef} afterDonate={afterDonate} blok={blok} name={formData.fname} />
        : null
      }
      { (step >= 3 || searchParams.get("_storyblok_c")) ?
        <PledgeShare innerRef={shareRef} blok={blok} name={formData.fname} slug={slug} state={state} />
        : null
      }
      
    </>
  );
};

export default Pledge;
