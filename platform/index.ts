export const platformInfo = {
  name: 'Crowdbucks',
  url: process.env.NODE_ENV === 'production' ? 'https://crowdbucks.fund' : 'http://localhost:3000',
  communityPrefix: '/',
  contact: {
    email: 'support@crowdbucks.fund'
  },
  footerInfo: process.env.NEXT_PUBLIC_PLATFORM_FOOTER_INFO || 'Crowdbucks',
}
