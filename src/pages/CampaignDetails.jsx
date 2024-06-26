import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { logo } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, vote, dvote, voter } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    if(state.amountCollected < state.target)
    {
      setIsLoading(true);

      await donate(state.pId, amount); 

      navigate('/')
      setIsLoading(false);
    }
    else
    {
      alert('Already received enough donations');
    }
  }

  const handleVote = async () => {
    const voted = await voter(state.pId)
    if (!voted)
    {
      setIsLoading(true);

      await vote(state.pId); 

      navigate('/')
      setIsLoading(false);
    }
    else{
      alert('Already voted for the campaign');
    }
  }

  const dhandleVote = async () => {
    const voted = await voter(state.pId)
    if (!voted)
    {
      setIsLoading(true);

      await dvote(state.pId); 

      navigate('/')
      setIsLoading(false);
    }
    else{
      alert('Already voted for the campaign');
    }
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>
          {state.approved?
          <div>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
        </div> :
        <div> 
            <p className="my-2 font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Votes are based on number of ASRA tokens donors hold</p>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Approval Votes</h4>
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.yesCount}</p>

            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Disapproval Votes</h4>
            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.noCount}</p>
        </div>
        }
          
        </div>
        { state.approved ? 
         <div className="flex-1">
         <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

         <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
           <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
             Fund the campaign
           </p>
           <div className="mt-[30px]">
             <input 
               type="number"
               placeholder="CANTO 0.1"
               step="0.01"
               className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
             />

             <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
               <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
               <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project and receive AASRA tokens to vote other campaigns</p>
             </div>

             <CustomButton 
               btnType="button"
               title="Fund Campaign"
               styles="w-full bg-[#8c6dfd]"
               handleClick={handleDonate}
             />
           </div>
         </div>
       </div>
      : 
      <div className="flex-1">
      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Vote</h4>   

      <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
        <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
          Vote for campaign approval or dissapproval
        </p>
        <div className="mt-[30px]">
          <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
            <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
            <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Vote the campaign to approve it to receive donations</p>
          </div>

          <CustomButton 
            btnType="button"
            title="Vote for Approval"
            styles="w-full bg-[#8c6dfd]"
            handleClick={handleVote}
          />

<div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
            <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Skeptical about campaign legitimacy? No worries.</h4>
            <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">You can vote for the dissapproval of the campaign</p>
          </div>

          <CustomButton 
            btnType="button"
            title="Vote for Disapproval"
            styles="w-full bg-[#8c6dfd]"
            handleClick={dhandleVote}
          />
        </div>
      </div>
    </div>
      }
        
      </div>
    </div>
  )
}

export default CampaignDetails