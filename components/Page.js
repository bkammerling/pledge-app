import { StoryblokComponent } from "@storyblok/react";
import { useState, useEffect } from 'react';
import Navigation from "./global/Navigation";

const Page = ({ blok }) => {
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
    <Navigation />
    
    {blok.body.map((nestedBlok) => (
      <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} ipDeets={userCountry} tag={blok.mailchimp_tag || ""} />
    ))}

  </>
)};

export default Page;
