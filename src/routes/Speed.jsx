import { useTranslation } from 'react-i18next'
import Head from '../components/Head'
import SmallModeList from '../components/SmallModeList'
import Footer from '../components/Footer'
import db from '../assets/db'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import Select from 'react-select'
import { firebaseApp, shuffle, todayDateValueCalc } from '../helpers'
import md5 from 'md5'
import ChCard from '../components/ChCard'
import Firecrackers from '../components/Firecrackers'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getAnalytics, logEvent } from 'firebase/analytics'

let gameLoopId

function Speed () {
  const { t } = useTranslation('global')
  const [timeLeft, setTimeLeft] = useState(5)

  const dateValue = todayDateValueCalc
  //console.log(dateValue)

  const modalWin = useRef()

  //Control del select
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCloseMenu = () => setIsMenuOpen(false)
  const handleOpenMenu = () => setIsMenuOpen(true)

  const [listaSeleccionable, setListaSeleccionable] = useState([])
  const [listaImagenes, setListaImagenes] = useState([])
  const [currentCh, setCurrentCh] = useState(0)
  const [jugando, setJugando] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [gameData, setGameData] = useState({})

  const analytics = getAnalytics(firebaseApp())
  function ganarAnalitic () {
    logEvent(analytics, 'win speed', {
      content_type: 'WIN',
      content_id: 'CL104',
      description: 'User win speed game'
    })
  }

  function updateClock () {
    setTimeLeft(t => t - 1)
    if (timeLeft - 1 == 0) {
      clearInterval(gameLoopId)
      gameLoopId == null
      setTerminado(true)
      setJugando(false)
      setGameData({
        //Guardar terminado
        ...gameData,
        today: md5(dateValue),
        total_today: {
          ...gameData.total_today,
          correct: currentCh
        },
        best:
          gameData.best.correct < currentCh
            ? {
                ...gameData.total_today,
                correct: currentCh
              }
            : gameData.best
      })
    }
  }

  useLayoutEffect(() => {
    if (jugando) {
      //El intervalo de jugar
      gameLoopId = setInterval(updateClock, 1000)
    }
    if (currentCh == db.length - 1) {
      //Si ha completado todos los personajes
      setTerminado(true)
      setJugando(false)
      setGameData({
        //Guardar terminado
        ...gameData,
        today: md5(dateValue),
        total_today: {
          ...gameData.total_today,
          correct: currentCh
        },
        best:
          gameData.best.correct < currentCh
            ? {
                ...gameData.total_today,
                correct: currentCh + 1
              }
            : gameData.best
      })
      window.alert('XD')
    }
    return () => {
      clearInterval(gameLoopId)
    }
  }, [timeLeft, jugando, currentCh])

  //Quitar personajes de una lista y agregar a la otra
  const selectCharacter = ch => {
    if (!jugando) {
      setJugando(true)
    }
    if (ch.value == listaImagenes[currentCh]?.id) {
      setCurrentCh(currentCh + 1)
      setTimeLeft(t => t + 3)
      setGameData({
        //Cambiar el tiempo total de hoy
        ...gameData,
        total_today: {
          ...gameData.total_today,
          time: gameData.total_today.time + 3
        }
      })
    }
  }

  useLayoutEffect(() => {
    setListaSeleccionable(
      shuffle(
        db.map(x => {
          //Force copy array
          return { ...x }
        })
      )
    )
    setListaImagenes(
      shuffle(
        db.map(x => {
          //Force copy array
          return { ...x }
        })
      )
    )
    const rawData = localStorage.getItem('speed-data')
    const gameData = JSON.parse(rawData) || {
      end: false,
      today: '',
      total_today: {
        correct: 0,
        time: 5
      },
      best: {
        correct: 0,
        time: 5
      }
    }

    if (md5(dateValue) == gameData.today) {
      setTerminado(true)
      setGameData({ ...gameData })
    } else {
      setGameData({ ...gameData, total_today: { correct: 0, time: 5 } })
    }
  }, [])

  useLayoutEffect(() => {
    if (terminado) {
      modalWin?.current?.showModal()
      localStorage.setItem('speed-data', JSON.stringify(gameData))
    }
  }, [terminado, gameData])

  return (
    <>
      <header className='w-full flex flex-col justify-between items-center gap-5 px-3'>
        <Head />
        <SmallModeList />
        <div
          className='text-center px-5 py-3 rounded-3xl mx-3 text-white
                 backdrop-blur-sm backdrop-brightness-[80%] w-full max-w-xl'
        >
          <h2 className='text-3xl font-black'>{t('speed.gameDisplay')}</h2>
          <p className='mt-3'>{t('gameDisplay.smallText')}</p>
        </div>
      </header>
      <main className='flex flex-col justify-center items-center gap-5 my-5 px-3'>
        {/*MODAL VICTORIA*/}
        <dialog
          ref={modalWin}
          className='rounded-3xl bg-white m-auto p-10 max-w-lg
          '
        >
          {terminado && <Firecrackers />}
          <button
            className='absolute top-5 right-5 rounded-full'
            type='button'
            onClick={() => {
              modalWin.current.close()
            }}
          >
            <XMarkIcon className='size-6 ' />
          </button>
          <header>
            <p className='text-[42px] text-yellow-400 text-center font-black saiyan fixSaiyan'>
              👏🏿 {t('win.title')} 👏🏿
            </p>
          </header>
          <main>
            <h1 className='text-center w-full text-2xl mt-5'>
              {t('speed.congratsSpeed')}
            </h1>
            <div className='mt-5 text-center text-xl'>
              <p>
                {t('aciertos')}
                {gameData?.total_today?.correct},{t('speed.time')}
                {gameData?.total_today?.time} s
              </p>
              <p>
                {t('speed.best')}
                {gameData?.best?.correct},{t('speed.time')}
                {gameData?.best?.time} s
              </p>
            </div>
            <div className='mt-5 text-sm'>
              <p>{t('win.next')}</p>
            </div>
          </main>
          <footer className='flex flex-col items-center gap-5 mt-8'>
            <hr className='w-full' />
            <SmallModeList />
          </footer>
        </dialog>
        {/**/}
        <div className='w-full flex flex-col sm:flex-row items-center sm:items-start justify-between max-w-xl'>
          <img
            className='min-w-[300px]'
            src={`ch/${listaImagenes[currentCh]?.id}.webp`}
            width={300}
            height={300}
            alt='character full body'
          />
          <div className='w-full flex flex-col gap-5'>
            <div
              className='text-3xl sm:text-6xl rounded-3xl bg-[var(--blue-soft)] 
            p-2  text-white w-full pt-1 inline-flex items-center justify-center'
            >
              <p>{String(timeLeft).padStart(3, '0')} s</p>
            </div>
            {!terminado && (
              <Select
                aria-label='Seleccinonar personaje'
                className='w-full '
                placeholder='Goku ...'
                styles={{
                  control: e => ({
                    ...e,
                    borderRadius: '20px',
                    border: 0,
                    ':hover': { border: 0 },
                    ':active': { border: 0 },
                    ':focus': { border: 0 }
                  }),
                  valueContainer: e => ({
                    ...e,
                    width: '100%'
                  }),
                  menuList: e => ({
                    ...e,
                    padding: 0
                  }),
                  menu: e => ({
                    ...e,
                    borderRadius: '20px'
                  }),
                  option: e => ({
                    ...e,
                    borderRadius: '20px',
                    padding: '5px'
                  })
                }}
                onMenuClose={handleCloseMenu}
                onChange={e => {
                  if (e) {
                    selectCharacter(e)
                  }
                }}
                value={null}
                isSearchable={true}
                isClearable={true}
                onMenuOpen={handleOpenMenu}
                menuIsOpen={isMenuOpen}
                options={listaSeleccionable.map(personaje => {
                  return {
                    value: personaje.id,
                    label: t('data.names.' + personaje.id)
                  }
                })}
                formatOptionLabel={p => {
                  return (
                    <div
                      className='inline-flex gap-4 justify-between
                 items-center rounded-3xl h-14 px-4'
                    >
                      <img
                        className='rounded-full'
                        src={'ch-faces/' + p.value + '.webp'}
                        width={50}
                        height={50}
                        alt={'face ' + p.label}
                      />
                      <p className='text-xl font-semibold'>{p.label}</p>
                    </div>
                  )
                }}
              />
            )}
          </div>
        </div>
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default Speed
