import { useState } from 'react'
import { render } from 'storyblok-rich-text-react-renderer';

const PledgeDonate = ({ blok, tag }) => {
  const [state, setState] = useState('idle');

  return (
    <section className="section pledge-donate">
      <div className="d-flex justify-content-center align-items-center py-5 vh-100">
       <h2>Thanks for signing</h2>
      </div>
      {/* End Contact Form */}

    </section>
  );
};

export default PledgeDonate;
