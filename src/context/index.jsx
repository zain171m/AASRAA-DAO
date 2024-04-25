import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xC0F183EA8d3374Ef7D37028B4075F49da871d389');
  const { mutateAsync: requestCampaign } = useContractWrite(contract, 'requestCampaign');

  const address = useAddress();
  const connect = useMetamask();


  const publishCampaign = async (form) => {
    try {
      const data = await requestCampaign({
				args: [
          form.name, //owner name
					form.title, // title
					form.description, // description
          new Date(form.deadline).getTime(), // deadline,
					form.target,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.amountGoal.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.imageUrl,
      pId: i,
      approved: campaign.approved,
      yesCount: ethers.utils.formatEther(campaign.yesCount.toString()),
      noCount: ethers.utils.formatEther(campaign.noCount.toString())
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateCampaign', [pId], { value: ethers.utils.parseEther(amount)});
    return data;
  }

  const vote = async (pId) => {
    const data = await contract.call('castVote', [pId, true]);
    return data;
  }

  const dvote = async (pId) => {
    const data = await contract.call('castVote', [pId, false]);
    return data;
  }
 

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonors', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const getBalance = async () => {
    try {
      const balance = await contract.call('balanceOf', [address]);
      return ethers.utils.formatEther(balance.toString());
    } catch (error) {
      console.error("Error getting balance:", error);
      return null;
    }
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        requestCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        vote,
        dvote,
        getBalance,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);