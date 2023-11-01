const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us6',
});


export default async (req, res) => {
  const { tag } = req.body;

  // Check if tag exists
  if (!tag || !tag.length) {
    return res.status(400).send( 'Tag is required')
  }
  
  const getSignees = async () => {
    console.log('in get signees');
    //Use get list segments with filters to get all tags
    try {
      const response = await mailchimp.lists.listSegments("2d457f53b0", {
        "since_created_at": "2023-1-1T15:41:36+00:00",
        "type": "static",
        "fields": ["segments.name","segments.member_count"],
        "include_transactional": true,
        "include_unsubscribed": true,
        "include_cleaned": true,
        "count": 50
      });
      if(response.segments) {
        const currentTag = response.segments.find((tagObj) => tagObj.name === tag);
        return res.status(200).json({ message: 'Got data', signees:  currentTag.member_count || 0 })
      } else {
        return res.status(500).json({ message: 'No segments found'})
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: `Error calling Mailchimp`})
    }
  };  
  getSignees();
  
}