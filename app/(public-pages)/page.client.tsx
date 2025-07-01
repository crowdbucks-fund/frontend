'use client'
import { VStack } from '@chakra-ui/react'
import { AstroSection } from 'app/(public-pages)/_components/AstroSection'
// import { Comments } from 'app/(public-pages)/_components/Comments'
import { ContactUs } from 'app/(public-pages)/_components/ContactUs'
import { DemoCTA } from 'app/(public-pages)/_components/DemoCTA'
import { Footer } from 'app/(public-pages)/_components/Footer'
import { Header } from 'app/(public-pages)/_components/Header'
import { MainProps } from 'app/(public-pages)/_components/Pros'
import { ServerCTA } from 'app/(public-pages)/_components/ServerCTA'
import { Steps } from 'app/(public-pages)/_components/Steps'

export default function HomePageClient() {
  return (
    <VStack>
      <Header />
      <MainProps />
      <DemoCTA />
      <AstroSection />
      {/* <Comments /> */}
      <Steps />
      <ServerCTA />
      <ContactUs />
      <Footer />
    </VStack>
  )
}
