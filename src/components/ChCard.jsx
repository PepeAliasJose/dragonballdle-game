function ChCard ({ ch, t, correcto }) {
  return (
    <div
      className={
        ' w-full inline-flex gap-4 justify-start items-center rounded-3xl up-flat px-4 h-20 text-white ' +
        (correcto ? ' bg-green-400 ' : ' bg-red-400 ')
      }
    >
      <img
        className='rounded-full'
        src={'ch-faces/' + ch.id + '.webp'}
        width={50}
        height={50}
        alt={'face ' + t('data.names.' + ch.id)}
      />
      <p className='text-xl font-semibold'>{t('data.names.' + ch.id)}</p>
    </div>
  )
}

export default ChCard
