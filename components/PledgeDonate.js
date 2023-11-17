import Script from 'next/script'
import { useEffect } from 'react'
import { render } from 'storyblok-rich-text-react-renderer';

const PledgeDonate = ({ innerRef, afterDonate, blok, name }) => {

  const donationSuccess = (donor, donation) => {
    // Send Google Event for TagManager
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: donation.transactionId,
        currency: donation.currency.name,
        value: Number(donation.amount),
        items: [
          {
            item_id: donation.formId,
            item_name: donation.formName,
            item_category: donation.frequency
          }
        ]
      },
      country: donor.country,
      zip: donor.postalCode,
      form: donation.formName,
      recurring: donation.recurring,
      sourceURL: donation.sourceUrl,
      referrer: document.referrer,
      transaction_id: donation.transactionId,
      value: Number(donation.amount),
    });
    // 
    // Setup redirect
    if(donation.paymentType !== 'undefined') {
      /*
      var website = 'https://globalhumanrights.org/donate-success/';
      var donationAttributes = ['amount', 'formName', 'transactionId' , 'organizationId', 'formId', 'frequency'];
      var queryParams = '?' + (donationAttributes || []).map(function(attr) { return attr + '=' + encodeURIComponent(donation[attr]) })
      .join('&');
      var finalRedirectURL = website + queryParams + '&currency=' + donation.currency.name;
      window.location = finalRedirectURL;
      */
      afterDonate(true);
    }
  }

  useEffect(() => {
    window.funraise.push('onSuccess', { form: 18354 }, donationSuccess);
  }, []);


  return (
    <>
      <Script id="funraise-aware">
        {`(function(f,u,n,r,a,i,s,e){var data={window:window,document:document,tag:"script",data:"funraise",orgId:f,uri:u,common:n,client:r,script:a};var scripts;var funraiseScript;data.window[data.data]=data.window[data.data]||[];if(data.window[data.data].scriptIsLoading||data.window[data.data].scriptIsLoaded)return;data.window[data.data].loading=true;data.window[data.data].push("init",data);scripts=data.document.getElementsByTagName(data.tag)[0];funraiseScript=data.document.createElement(data.tag);funraiseScript.async=true;funraiseScript.src=data.uri+data.common+data.script+"?orgId="+data.orgId;scripts.parentNode.insertBefore(funraiseScript,scripts)})('339fd70c-b9c5-4839-bb00-d05ef087d209','https://assets.funraise.io','/widget/common/2.0','/widget/client','/inject-form.js');`}
      </Script>
      <Script id="funraise-form">
        {`window.funraise.push('create', { form: 18354 });
        window.funraise.push('config', { form: 18354 }, {
          defaultValues: {
            ask: '5,10,20,50',
          },
        });
        `}
      </Script>
      
      <section className="section pledge-donate border-top border-bottom" ref={innerRef} style={{ backgroundImage: `url(${blok.background_img?.filename}/m/1800x0/smart)` }}>

        <div className="container">
          <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-100 text-center">
            <div className="card donate-card p-3 border-0">
              <div className="card-body">
                <h2>{ name }{ name ? " - " : ""}{ blok.donate_heading }</h2>
                <div className="mt-3 mb-4">
                  { render(blok.donate_text) }
                </div>
                <div className="row justify-content-center">
                  <div className="col-sm-8 col-md-6">                    
                    <div className="d-grid gap-3">
                      <button id="first-donate-button" type="button" className="btn btn-primary fw-semibold" data-formid="18354" data-amount="5">Yes, I'll give $5</button>
                      <button type="button" className="btn btn-primary fw-semibold" data-formid="18354" data-amount="10">Yes, I'll give $10</button>
                      <button type="button" className="btn btn-primary fw-semibold" data-formid="18354" data-amount="20">Yes, I'll give $20</button>
                      <button id="skip-donation-button" type="button" onClick={afterDonate} className="btn text-dark btn-link">No thanks, I'll skip</button>
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

export default PledgeDonate;
