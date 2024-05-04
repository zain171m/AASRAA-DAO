import { createCampaign, dashboard, logout, payment, profile, withdraw, disapprove } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'disapprove',
    imgUrl: disapprove,
    link: '/Unapproved',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  }, 
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
];
