import React, { useState, useEffect } from 'react'

import { DisplayUCampaigns } from '../components';
import { useStateContext } from '../context'

const Unapproved = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayUCampaigns 
      title="All Unapproved Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Unapproved