export const formatCardNumber = (number: string) =>
  number.split('').reduce((tier, next, index) => {
    if (index !== 0 && !(index % 4)) tier += ' '
    return tier + next
  }, '')
