function GameMode ({ href, title, subtitle, img, event, expand = false }) {
  return (
    <a
      href={href}
      className='w-full max-w-sm hover:scale-105
       transition-transform rounded-full shadow-xl'
      onClick={event}
    >
      <div
        className='w-full p-2 rounded-full 
      bg-[var(--blue-soft)] inline-flex
       text-white items-center gap-5'
      >
        <img
          className={expand && ' scale-105 '}
          src={img}
          width={80}
          height={80}
          alt='Gamemode icon'
        />
        <div>
          <h3 className='saiyan fixSaiyan text-4xl text-shadow-lg'>{title}</h3>
          <p className='font-bold text-shadow-lg'>{subtitle}</p>
        </div>
      </div>
    </a>
  )
}

export default GameMode
