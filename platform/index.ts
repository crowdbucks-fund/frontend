export const platformInfo = {
  name: 'Crowdbucks',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://crowdbucks.fund',
  communityPrefix: '/',
  contact: {
    email: 'support@crowdbucks.fund',
    mastodon: {
      handle: '@crowdbucks_support',
      link: 'https://mastodon.social/@crowdbucks_support'
    }
  },
  footerInfo: process.env.NEXT_PUBLIC_PLATFORM_FOOTER_INFO || 'Crowdbucks',
}
