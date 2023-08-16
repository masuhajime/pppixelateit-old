type Props = {
  imageBase64?: string | undefined
}
export const ImagePreview = (props: Props) => {
  if (!props.imageBase64) {
    return <></>
  }

  return (
    <>
      {!!props.imageBase64 && (
        <div
          style={{
            backgroundImage: `url(assets/transparant-background.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat',
          }}
        >
          <img
            src={props.imageBase64}
            style={{
              width: '100%',
              height: 'auto',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      )}
    </>
  )
}
