import { StoryblokComponent } from "@storyblok/react";
import { useState, useEffect } from 'react';
import Script from "next/script";
import Navigation from "./global/Navigation";

const Page = ({ blok, slug }) => {
  const [userCountry, setUserCountry] = useState({});

  useEffect(() => {

    const getIPDetails = async () => {
      await fetch('https://ipapi.co/json/')
      .then( res => res.json())
      .then(response => {
          const country = response.country_name;
          const obj = { continent_code: response.continent_code, country };
          setUserCountry(obj);
      })
      .catch((data, status) => {
        console.log(data, status);
      })
    }   
    getIPDetails(); 
    return () => {
      setUserCountry({}); 
    };
  }, [])

  return (
  <>
    <Script id="consent-defaults">
      {`
        // Define dataLayer and the gtag function.
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}

        // Default ad_storage to 'granted' as we're US only.
        gtag('consent', 'default', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'personalization_storage': 'granted',
        });
      `}
    </Script>
    <Script id="google-tag-manager">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MVZ6KSN8');
      `}
    </Script>

    <Navigation />
    
    {blok.body.map((nestedBlok) => (
      <StoryblokComponent blok={nestedBlok} slug={slug} key={nestedBlok._uid} ipDeets={userCountry} tag={blok.mailchimp_tag || ""} />
    ))}

  </>
)};

export default Page;
