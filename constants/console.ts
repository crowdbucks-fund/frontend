import { ChakraComponent } from '@chakra-ui/react'
// import CreateIcon from 'assets/icons/add-circle.svg?react'
// import CommunitiesIcon from 'assets/icons/communities NB.svg?react'
import HomeIcon from 'assets/icons/home NB.svg?react'
// import InsightIcon from 'assets/icons/insight NB.svg?react'
// import FAQIcon from 'assets/icons/message-question.svg?react'
// import SettingsIcon from 'assets/icons/setting.svg?react'
// import ContactUsIcon from 'assets/icons/sms-tracking.svg?react'
import StripeIcon from 'assets/icons/stripe.svg?react'

export const sideBarMenu = [
  {
    title: 'Home',
    icon: HomeIcon,
    link: '/console',
    prefetch: true,
  },
  // {
  //   title: 'Communities',
  //   icon: CommunitiesIcon,
  //   link: '/console/communities',
  //   prefetch: true,
  // },
  //   {
  //     title: 'Insights',
  //     icon: InsightIcon,
  //     link: '/console/insights',
  //     prefetch: false,
  //   },
  {
    title: 'Stripe',
    icon: StripeIcon,
    link: '/console/stripe',
    prefetch: true,
  },
  //   {
  //     title: 'Settings',
  //     icon: SettingsIcon,
  //     link: '/console/settings',
  //     prefetch: false,
  //   },
  //   {
  //     title: 'FAQ',
  //     icon: FAQIcon,
  //     link: '/console/faq',
  //     prefetch: false,
  //   },
  //   {
  //     title: 'Contact us',
  //     icon: ContactUsIcon,
  //     link: '/console/contact-us',
  //     prefetch: false,
  //   },
]

export const mobileSharedLayoutMenu = [
  {
    title: 'Home',
    icon: HomeIcon,
    link: '/console',
  },
  // {
  //   title: 'Communities',
  //   icon: CommunitiesIcon,
  //   link: '/console/communities',
  // },
  {
    title: 'Stripe',
    icon: StripeIcon,
    link: '/console/stripe',
  },
]

export const mobileSidebarMenu: { title: string; icon: ChakraComponent<typeof StripeIcon>; link: string }[] = [
  //   {
  //     title: 'FAQ',
  //     icon: FAQIcon,
  //     link: '/console/faq',
  //   },
  //   {
  //     title: 'Contact us',
  //     icon: ContactUsIcon,
  //     link: '/console/contact-us',
  //   },
]

export const mobileNavigationMenu = [
  {
    title: 'Home',
    icon: HomeIcon,
    link: '/console',
    prefetch: true,
  },
  // {
  //   title: 'Create',
  //   icon: CreateIcon,
  //   link: '/console/communities',
  //   prefetch: true,
  // },
  //   {
  //     title: 'Insights',
  //     icon: InsightIcon,
  //     link: '/console/insights',
  //     prefetch: false,
  //   },
]

export const consoleMenu = [
  {
    title: 'Home',
    icon: HomeIcon,
    link: '/console',
    prefetch: true,
  },
  // {
  //   title: 'Communities',
  //   icon: CommunitiesIcon,
  //   link: '/console/communities',
  //   prefetch: true,
  // },
  {
    title: 'Stripe',
    icon: StripeIcon,
    link: '/console/stripe',
    prefetch: true,
  },
  //   {
  //     title: 'Insights',
  //     icon: InsightIcon,
  //     link: '/console/insights',
  //     prefetch: false,
  //   },
]
