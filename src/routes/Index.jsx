import { useTranslation } from 'react-i18next'
import Head from '../components/Head'
import Footer from '../components/Footer'
import GameMode from '../components/GameMode'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { firebaseApp } from '../helpers'

function Index () {
  const { t } = useTranslation('global')
  const analytics = getAnalytics(firebaseApp())
  return (
    <>
      <header className='w-full flex flex-col justify-between items-center'>
        <Head />
        <div
          className='text-center px-4 py-1 rounded-3xl mx-3 md:rounded-full
         backdrop-blur-sm backdrop-brightness-100 text-white mt-5'
        >
          <h2 className='text-[28px] font-black leading-[32px] gap-3'>
            {t('sign.guess')}
            <span className='saiyan fixSaiyan text-[2rem] text-yellow-400 ml-3'>
              DRAGON
            </span>{' '}
            <span className='saiyan fixSaiyan text-[2rem] text-red-500'>
              BALL
            </span>
          </h2>
        </div>
      </header>
      <main className='flex flex-col justify-center items-center gap-5 mt-6 mb-12 px-3'>
        <GameMode
          href={'/clasic'}
          img={'db-resources/esfera6s.webp'}
          title={t('modes.titles.clasic')}
          subtitle={t('modes.descriptions.clasic')}
          event={() => {
            logEvent(analytics, 'go clasic', {
              content_type: 'Navigation',
              content_id: 'CL001',
              description: 'User goes to clasic game'
            })
          }}
          expand
        />
        <GameMode
          href={'/shadow'}
          img={'db-resources/sombra.webp'}
          title={t('modes.titles.shadow')}
          subtitle={t('modes.descriptions.shadow')}
          event={() => {
            logEvent(analytics, 'go shadow', {
              content_type: 'Navigation',
              content_id: 'CL002',
              description: 'User goes to shadow game'
            })
          }}
        />
        <GameMode
          href={'/buu'}
          img={'db-resources/buu.webp'}
          title={t('modes.titles.buu')}
          subtitle={t('modes.descriptions.buu')}
          event={() => {
            logEvent(analytics, 'go buu', {
              content_type: 'Navigation',
              content_id: 'CL003',
              description: 'User goes to buu game'
            })
          }}
        />
        <GameMode
          href={'/speed' /*TODO: hacer los locales*/}
          img={'db-resources/crono.webp'}
          title={t('modes.titles.speed')}
          subtitle={t('modes.descriptions.speed')}
          event={() => {
            logEvent(analytics, 'go speed', {
              content_type: 'Navigation',
              content_id: 'CL004',
              description: 'User goes to speed game'
            })
          }}
        />
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default Index
