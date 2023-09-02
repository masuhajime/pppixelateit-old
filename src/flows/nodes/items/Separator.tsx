import { Divider } from '@mui/material'

type Props = { thickness?: number }
export const Separator = (props: Props) => {
  const thickness = props.thickness ?? 2
  return (
    <Divider
      sx={{
        borderBottomWidth: `${thickness}px`,
      }}
    />
  )
}
