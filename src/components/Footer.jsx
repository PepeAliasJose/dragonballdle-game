import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

function Footer ({ short = false }) {
  const { i18n } = useTranslation()
  //console.log(i18n.language)
  const handleLanguageChange = e => {
    const newLang = e.target.value
    //console.log(e)
    localStorage.setItem('lng', e.target.value)
    i18n.changeLanguage(newLang)
  }
  return (
    <div
      className='inline-flex gap-2 items-center
     justify-center p-2 bg-[var(--blue-soft)] rounded-full mb-5 up-flat'
    >
      <a
        href='/info'
        className='w-12 bg-white rounded-full aspect-square inline-flex
         justify-center items-center'
      >
        <InformationCircleIcon className='size-10' />
      </a>
      <div className='w-12 aspect-square hover:scale-110'>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://ko-fi.com/kyton8'
        >
          <img
            className='size-12'
            src='db-resources/ko-fi.webp'
            width={64}
            height={64}
            alt='kofi logo'
          />
        </a>
      </div>
    </div>
  )
}

export default Footer
