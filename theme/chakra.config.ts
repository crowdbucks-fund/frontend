import { extendTheme } from '@chakra-ui/react'
import { colors } from './colors'
import { Accordion } from './components/accordion'
import { Alert } from './components/alert'
import { Button } from './components/button'
import { Card } from './components/card'
import { Checkbox } from './components/checkbox'
import { Container } from './components/container'
import { Drawer } from './components/drawer'
import { Input } from './components/input'
import { PinInput } from './components/pinInput'
import { Progress } from './components/progress'
import { Select } from './components/select'
import { Textarea } from './components/textarea'

export const theme = extendTheme({
  useSystemColorMode: false,
  initialColorMode: 'light',
  colors,
  fonts: {
    heading: "'SF Pro Display', sans-serif",
    body: "'SF Pro Display', sans-serif",
  },
  textStyles: {
    bold22: {
      fontSize: {
        base: '16px',
        md: '22px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold20: {
      fontSize: {
        base: '16px',
        md: '20px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    regular10: {
      fontSize: {
        base: '10px',
      },
      fontWeight: 'normal',
    },
    regular20: {
      fontSize: {
        base: '16px',
        md: '20px',
      },
      fontWeight: 'normal',
      color: 'brand.black.1',
    },
    regular16: {
      fontSize: {
        base: '16px',
        md: '16px',
      },
      fontWeight: 'normal',
      color: 'brand.black.1',
    },
    regular14: {
      fontSize: {
        base: '14px',
      },
      fontWeight: 'normal',
    },
    regular22: {
      fontSize: {
        base: '16px',
        md: '22px',
      },
      fontWeight: 'normal',
      color: 'brand.black.1',
    },
    regular18: {
      fontSize: {
        base: '12px',
        md: '18px',
      },
      fontWeight: 'normal',
      color: 'brand.black.1',
    },
    medium20: {
      fontSize: '20px',
      fontWeight: 'medium',
    },
    medium12: {
      fontSize: '12px',
      fontWeight: 'medium',
    },
    medium14: {
      fontSize: '14px',
      fontWeight: 'medium',
    },
    medium18: {
      fontSize: {
        base: '12px',
        md: '18px',
      },
      fontWeight: 'medium',
      color: 'brand.black.1',
    },
    medium16: {
      fontSize: {
        base: '12px',
        md: '16px',
      },
      fontWeight: 'medium',
      color: 'brand.black.1',
    },
    bold14: {
      fontSize: {
        base: '14px',
      },
      fontWeight: 'bold',
    },
    bold16: {
      fontSize: {
        base: '16px',
      },
      fontWeight: 'bold',
    },
    bold72: {
      fontSize: {
        base: '72px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold38: {
      fontSize: {
        base: '38px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold30: {
      fontSize: {
        base: '30px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold58: {
      fontSize: {
        base: '58px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold28: {
      fontSize: {
        base: '28px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    bold18: {
      fontSize: {
        base: '18px',
      },
      fontWeight: 'bold',
      color: 'brand.black.1',
    },
    hint: {
      fontSize: {
        base: '10px',
        md: '14px',
      },
      color: 'brand.black.3',
    },
    modalTitle: {
      fontSize: {
        base: '22px',
        md: '28px',
      },
      fontWeight: {
        base: 'medium',
        md: 'bold',
      },
    },
  },
  components: {
    Button,
    Input,
    PinInput,
    Drawer,
    Textarea,
    Alert,
    Select,
    Checkbox,
    Card,
    Progress,
    Accordion,
    Container,
  },
})

export default theme
