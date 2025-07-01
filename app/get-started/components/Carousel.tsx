import { Box, BoxProps } from '@chakra-ui/react'
import { FC } from 'react'
import { Carousel as CarouselComponent, CarouselProps } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export const Carousel: FC<Partial<CarouselProps> & { wrapperProps?: BoxProps }> = ({ wrapperProps, ...carouselProps }) => {
  return (
    <Box
      maxW="100%"
      w="380px"
      __css={{
        '.carousel': {
          maxWidth: '100%',
          width: '380px',
          '.control-dots': {
            bottom: '35px !important',
          },
          svg: {
            width: {
              md: '380px',
              base: '80%',
            },
            maxW: '100%',
          },
        },
      }}
      {...wrapperProps}
    >
      <CarouselComponent
        emulateTouch
        showStatus={false}
        autoPlay
        showArrows={false}
        showThumbs={false}
        interval={3000}
        swipeable
        infiniteLoop
        stopOnHover={false}
        renderIndicator={(e, isSelected, index) => {
          return (
            <Box
              key={index}
              rounded="full"
              bgColor={isSelected ? 'primary.500' : 'primary.50'}
              display="inline-block"
              px={isSelected ? '3' : '6px'}
              py="2px"
              mr={index !== 3 ? '1' : 0}
              transition="all .2s ease"
              cursor="pointer"
              onClick={e}
            />
          )
        }}
        {...carouselProps}
      />
    </Box>
  )
}
