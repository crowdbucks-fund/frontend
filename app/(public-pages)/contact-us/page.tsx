'use client'
import { VStack } from '@chakra-ui/react'
import { ContactUs } from 'app/(public-pages)/_components/ContactUs'
import { DemoCTA } from 'app/(public-pages)/_components/DemoCTA'
import { Footer } from 'app/(public-pages)/_components/Footer'
import { Navbar } from 'app/(public-pages)/_components/Navbar'

export default function HomePageClient() {
  return (
    <VStack id="home-page">
      <Navbar />
      <ContactUs showShapes />
      <DemoCTA />
      <Footer />
    </VStack>
  )
}
