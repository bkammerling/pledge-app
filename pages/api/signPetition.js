const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us6',
});

const checkEmail = async (email, tag) => {
  // set up search query to mailchimp to return less data and be more performant
  const opts = {
    fields: ['exact_matches'],
    exclude_fields: ['full_search','_links','exact_matches.members.merge_fields','exact_matches.members.interests','exact_matches.members.stats','exact_matches.members.location','exact_matches.members._links'],
  }
  // call mailchimp
  const response = await mailchimp.searchMembers.search(email, opts);
  // check to see if mailchimp found an email address
  const found = response.exact_matches.total_items > 0;
  // if mailchimp found something, check to see if email has the petition tag 
  let signed = false;
  if(found) {
    signed = response.exact_matches.members[0].tags.filter((tagObj) => tagObj.name === tag).length > 0;
  }
  return signed;
}


export default async (req, res) => {
  const { formData, tag, ipDeets } = req.body;

  // Check if email exists
  if (!formData.email || !formData.email.length) {
    return res.status(400).send( 'Email is required')
  }
  
  // Check to see if email address already signed this petition
  if(await checkEmail(formData.email, tag)) {
    console.log('already signed');
    return res.status(202).json({ message: 'Email already signed' })
  }

  const status = formData.optin == "yes" ? "subscribed" : "transactional";

  // TEST IF IPDEETS = {}

  const subscriberData = {
    email_address: formData.email,
    status_if_new: status,
    merge_fields: {
      FNAME: formData.fname,
      LNAME: formData.lname,
      COUNTRY: ipDeets.country ? ipDeets.country : ""
    },
    interests: {
      "13580ba4f1": true,
    },
    tags: [tag]
  }

  // Set the region group based on user continent (if we have IP data)
  if(ipDeets.continent_code) {
    let regionGroupID = "5dae829b2c";
    if(ipDeets.continent_code == "EU") regionGroupID = "0c88291c31";
    if(ipDeets.continent_code == "NA") regionGroupID = "53ce7d13cc" 
    subscriberData.interests[regionGroupID] = true;
  }
  console.log(subscriberData);

  const addSubscriber = async () => {
    console.log('in add subscriber');
    try {
      const response = await mailchimp.lists.setListMember("2d457f53b0", subscriberData.email_address, subscriberData);
      if (!response.id) {
        console.log('issue adding subscriber not added')
        return res.status(400).json({ message: 'Mailchimp returned but unknown error'})
      }
      console.log('added subscriber')
      const eventResponse = await mailchimp.lists.createListMemberEvent("2d457f53b0", subscriberData.email_address, { name: "Signed_pledge", properties: { tag } });
      return res.status(201).json({ message: 'Email successfully added to signatures'})
    } catch (error) {
      console.log(error.response?.text);
      console.log(error);
      return res.status(500).json({ message: `Error calling Mailchimp`, detail: `${error.response?.body?.detail}`})
    }
  };  
  addSubscriber();
  
}