import { useTranslation } from 'react-i18next'
import Footer from '../components/Footer'
import Head from '../components/Head'
import SmallModeList from '../components/SmallModeList'

function Information () {
  const { t } = useTranslation('global')

  return (
    <>
      <header className='w-full flex flex-col justify-between items-center'>
        <Head />
        <SmallModeList />
      </header>
      <main className='flex flex-col justify-center items-center gap-5 mt-6 mb-12 px-3'>
        <div className='p-10 max-w-xl mx-3 text-white bg-[var(--blue-soft)] rounded-3xl'>
          <h2 className='text-2xl font-semibold pb-5'>{t('info.title')}</h2>
          <div className='flex flex-col gap-5'>
            <p>{t('info.description')}</p>

            <p>{t('info.copyright')}</p>

            <p>{t('info.inspired')}</p>

            <p>
              {t('info.contact')}{' '}
              <a
                className='font-semibold underline'
                href='mailto:yonkousgames@gmail.com'
              >
                yonkousgames@gmail.com
              </a>
            </p>
            <div className='flex flex-col gap-2'>
              <p>
                Photo editing and collection:{' '}
                <a
                  className='underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://www.instagram.com/sajilive/'
                >
                  @Sajilive
                </a>
              </p>
              <p>DragonBall wiki: Valentin Sánchez</p>
              <p>
                Lead Programmer/Designer:{' '}
                <a
                  className='underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='/'
                >
                  PepeRCFoundry
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default Information
