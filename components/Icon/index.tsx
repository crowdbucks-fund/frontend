import dynamic from 'next/dynamic'
import { FC, SVGAttributes } from 'react'

interface Props extends SVGAttributes<SVGElement> {
  path: string
}

export const Icon: FC<Props> = ({ path, ...props }) => {
  const Icon = dynamic(() => import(path))
  return <Icon {...props} />
}
