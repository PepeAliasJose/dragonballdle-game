const SmallModeList = ({ getAnalytics = undefined }) => {
  return (
    <div className='w-full max-w-[250px] inline-flex justify-evenly'>
      <img
        className='absolute self-center -z-10'
        alt='Linea decorativa'
        width={250}
        height={25}
        src='db-resources/blueLine.webp'
      />
      <SmallModeListImage
        getAnalytics={getAnalytics}
        href='/clasic'
        img='db-resources/esfera6s.webp'
      />
      <SmallModeListImage
        getAnalytics={getAnalytics}
        href='/shadow'
        img='db-resources/sombra.webp'
      />
      <SmallModeListImage
        getAnalytics={getAnalytics}
        href='/buu'
        img='db-resources/buu.webp'
      />
      <SmallModeListImage
        getAnalytics={getAnalytics}
        href='/speed'
        img='db-resources/crono.webp'
      />
    </div>
  )
}

export default SmallModeList

const SmallModeListImage = ({ href, img, getAnalytics }) => {
  return (
    <div className='px-0.5 size-14 hover:scale-110 transition-transform'>
      <a
        href={href}
        onClick={() => {
          return 0 // TODO: Agregar analiticas
          logEvent(getAnalytics, 'Shortcut_to_' + href, {
            content_type: 'Link',
            content_id: 'BM000',
            description: 'User go to buu mode'
          })
        }}
      >
        <img
          alt={'Icono enlace a ' + href}
          src={img || 'images/esfera6s.png'}
          width={60}
          height={60}
        />
      </a>
    </div>
  )
}
