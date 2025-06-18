import { useTranslation } from 'react-i18next'
import Head from '../components/Head'
import SmallModeList from '../components/SmallModeList'
import Footer from '../components/Footer'
import db from '../assets/db'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import Select from 'react-select'
import { firebaseApp, shuffle } from '../helpers'
import md5 from 'md5'
import ChCard from '../components/ChCard'
import Firecrackers from '../components/Firecrackers'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getAnalytics, logEvent } from 'firebase/analytics'

function Boo () {
  const { t } = useTranslation('global')

  const NUMERO_DE_PERSONAJES = 85
  const [booList, setBuuList] = useState([])

  const userTimezoneOffset = new Date().getTimezoneOffset() * 60000

  const dateValue = Math.floor(
    (new Date().getTime() -
      userTimezoneOffset -
      new Date(2022, 7, 16).getTime()) /
      (1000 * 60 * 60 * 24)
  ) //Calculo para tener un dia cada 1

  const todayNumber = dateValue % NUMERO_DE_PERSONAJES
  //console.log('SHHH: ', todayNumber, new Date().getTime())
  const yesterdayNumber = todayNumber - 1

  const [listaSeleccionable, setListaSeleccionable] = useState([])
  const [listaUsados, setListaUsados] = useState([])
  const [ganado, setGanado] = useState(false)
  const [gameData, setGameData] = useState({})

  const modalWin = useRef()
  //Control del select
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCloseMenu = () => setIsMenuOpen(false)
  const handleOpenMenu = () => setIsMenuOpen(true)

  //Quitar personajes de una lista y agregar a la otra
  const selectCharacter = ch => {
    const l = listaSeleccionable.filter(chr => {
      if (chr.id == ch.value) {
        return true
      } else return false
    })
    const updatedUsedList = [...l, ...listaUsados]
    setListaUsados(updatedUsedList)
    setListaSeleccionable(
      listaSeleccionable.filter(chr => {
        if (chr.id == ch.value) {
          return false
        } else return true
      })
    )
    //Comprobar si ha ganado
    let updatedData
    if (ch.value == booList[todayNumber]?.id) {
      const todayId = md5(todayNumber + 1)
      const yesterdayId = md5(yesterdayNumber + 1)

      if (yesterdayId == gameData.win) {
        //Si gano ayer agregar racha
        updatedData = { ...gameData, streak: gameData.streak + 1 }
      } else {
        updatedData = { ...gameData, streak: 1 }
      }

      updatedData = {
        ...updatedData,
        win: todayId,
        tries: updatedUsedList,
        total: updatedData.total + 1
      }
      setGameData(updatedData)

      //Animacion y procedimiento de ganar
      setGanado(true)
    } else {
      //Sumar intentos
      updatedData = { ...gameData, tries: updatedUsedList }
      setGameData(updatedData)
    }

    //Update local storage
    localStorage.setItem('buu-data', JSON.stringify(updatedData))
  }

  //Primera comprobacion
  useLayoutEffect(() => {
    const listaBuu = db.filter(x => {
      return x.modoBuu
    })
    //console.log(listaBuu)
    setBuuList(listaBuu)
    setListaSeleccionable(
      shuffle(
        listaBuu.map(x => {
          //Force copy array
          return { ...x }
        })
      )
    )
    const rawData = localStorage.getItem('buu-data')
    const gameData = JSON.parse(rawData) || {
      win: false,
      win_ch: '',
      lastWin: null,
      tries: [],
      streak: 0,
      total: 0
    }
    if (gameData.win == md5(todayNumber + 1)) {
      setGameData(gameData)
      setGanado(gameData.win == md5(todayNumber + 1))
      setListaUsados(gameData.tries)
    } else if (gameData.win_ch == md5(todayNumber + 1)) {
      setListaUsados(gameData.tries)
      setGameData(gameData)
    } else {
      setGameData({ ...gameData, tries: [], win_ch: md5(todayNumber + 1) })
    }
  }, [])

  const analytics = getAnalytics(firebaseApp())
  useEffect(() => {
    if (ganado) {
      modalWin.current.showModal()
      logEvent(analytics, 'win boo', {
        content_type: 'WIN',
        content_id: 'CL102',
        description: 'User win boo game'
      })
    }
  }, [ganado])

  const listaUsadosComponente = listaUsados.map(ch => {
    return <ChCard ch={ch} t={t} correcto={ch.id == booList[todayNumber]?.id} />
  })

  return (
    <>
      <header className='w-full flex flex-col justify-between items-center gap-5 px-3'>
        <Head />
        <SmallModeList />
        <div
          className='text-center px-5 py-3 rounded-3xl mx-3 text-white
                 backdrop-blur-sm backdrop-brightness-[80%] w-full max-w-xl'
        >
          <h2 className='text-3xl font-black'>{t('modoBuu.gameDisplay')}</h2>
          <p className='mt-3'>{t('gameDisplay.smallText')}</p>
        </div>
        <div className='text-white p-2 px-4 rounded-2xl backdrop-brightness-[80%]'>
          <p>
            {' '}
            {t('clasic.yesterdayCharacter')}{' '}
            {t('data.names.' + booList[todayNumber - 1]?.id)}
          </p>
        </div>
      </header>
      <main
        className='flex flex-col-reverse sm:flex-row-reverse
       justify-center items-center sm:items-start sm:justify-between gap-5 my-5 w-full max-w-xl mx-auto'
      >
        <dialog
          ref={modalWin}
          className='rounded-3xl bg-white m-auto p-10 max-w-lg
          '
        >
          {ganado && <Firecrackers />}
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
              {t('win.congratsBuu')}
            </h1>
            <div className='flex flex-row gap-5 justify-center mt-8'>
              <img
                className='rounded-xl border-2'
                src={'ch-faces/' + booList[todayNumber]?.id + '.webp'}
                width={100}
                height={100}
              />
              <div>
                <h2 className='text-2xl font-semibold'>
                  {t('data.names.' + booList[todayNumber]?.id)}
                </h2>
                <p className='text-sm text-gray-500'>
                  {t('win.try1') +
                    ' ' +
                    gameData?.tries?.length +
                    ' ' +
                    t('win.try2')}
                </p>
                <p className='text-lg text-gray-900'>
                  {t('racha') + ' ' + gameData?.streak}{' '}
                  {gameData?.streak > 30
                    ? '🎉'
                    : gameData?.streak > 10
                    ? '🔥'
                    : '👀'}
                </p>
              </div>
            </div>
            <div className='mt-5 text-center text-xl'>
              <p>
                {t('aciertos')}
                {gameData?.total}
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
        <div className='flex flex-col gap-5 px-3 sm:px-0 w-full'>
          {!ganado && (
            <div className=''>
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
                      className='inline-flex gap-4 justify-center
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
            </div>
          )}
          {listaUsadosComponente}
        </div>
        <div
          className='
         max-w-[300px] sm:min-w-[300px] bg-[#60DF90] rounded-3xl border-2 border-green-800'
        >
          <img
            src={`ch-fusion/${booList[todayNumber]?.id}.webp`}
            width={300}
            height={300}
            alt='character'
          />
        </div>
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default Boo
