'use client'
import { VStack } from '@chakra-ui/react'
import { Footer } from 'app/(public-pages)/_components/Footer'
import { Header2 } from 'app/(public-pages)/_components/Header/Header2'
import { MainProps } from 'app/(public-pages)/_components/Pros'
import { ServerCTA } from 'app/(public-pages)/_components/ServerCTA'
import { Steps } from 'app/(public-pages)/_components/Steps'

export default function HomePageClient() {
  return (
    <VStack id="home-page" position="relative" overflowY="hidden">
      <Header2 />
      <MainProps showShapes />
      <Steps />
      <ServerCTA shapesStyle="custom" />
      <Footer />
    </VStack>
  )
}
