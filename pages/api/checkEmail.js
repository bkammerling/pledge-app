const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us6',
});


export default async (req, res) => {
  const { email } = req.body;

  if (!email || !email.length) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const opts = {
    fields: ['exact_matches'],
    exclude_fields: ['full_search','_links','exact_matches.members.merge_fields','exact_matches.members.interests','exact_matches.members.stats','exact_matches.members.location','exact_matches.members._links'],
  }

  async function run() {
    const response = await mailchimp.searchMembers.search(email, opts);
    const found = response.exact_matches.total_items > 0;
    if(found) {
      response.exact_matches.members[0].tags.filter((tag) => tag.name == 'Signed');
    }
    return res.status(201).json(response);
  }
  
  run();

}
