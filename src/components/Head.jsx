import { useTranslation } from 'react-i18next'

function Head ({ short = true }) {
  const { i18n } = useTranslation()
  //console.log(i18n.language)
  const handleLanguageChange = e => {
    const newLang = e.target.value
    //console.log(e)
    localStorage.setItem('lng', e.target.value)
    i18n.changeLanguage(newLang)
  }
  return (
    <div className='inline-flex gap-2 items-center justify-center mt-10'>
      <img
        className='size-10 sm:size-16'
        src='db-resources/logo192.webp'
        width={192}
        height={192}
        alt='Dragonballdle logo'
      />
      <a
        href='/'
        className='scale-90 hover:scale-100 transition-transform mt-2'
      >
        <h1 className='saiyan text-4xl sm:text-6xl leading-none '>
          <span className='text-yellow-400'>DRAGON</span>{' '}
          <span className='text-red-500'>BALLDLE</span>
        </h1>
      </a>

      <select
        aria-label='idioma'
        id='idioma'
        name='idioma'
        className='px-2.5 py-1 rounded-full bg-white h-fit border-2 border-orange-400'
        value={i18n.language}
        onChange={handleLanguageChange}
      >
        <option value='en'>{short ? '🇺🇸' : '🇺🇸 English'}</option>
        <option value='es'>{short ? '🇪🇸' : '🇪🇸 Español'}</option>
        {/*<option value="zh">{props.short ? "🇨🇳" : "🇨🇳 中文"}</option>
        <option value="ja">{props.short ? "🇯🇵" : "🇯🇵 日本語"}</option>
        <option value="ru">{props.short ? "🇷🇺" : "🇷🇺 Русский"}</option>*/}
        <option value='pt'>{short ? '🇧🇷' : '🇧🇷 Português'}</option>
      </select>
    </div>
  )
}

export default Head
