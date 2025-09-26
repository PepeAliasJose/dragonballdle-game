import { useTranslation } from 'react-i18next'
import Footer from '../components/Footer'
import Head from '../components/Head'
import SmallModeList from '../components/SmallModeList'
import Tutorial from '../components/Tutorial'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import db from '../assets/db'
import Select from 'react-select'
import gsap from 'gsap'
import md5 from 'md5'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Firecrackers from '../components/Firecrackers'
import { getAnalytics } from 'firebase/analytics'
import { firebaseApp } from '../helpers'

function Clasic () {
  const { t } = useTranslation('global')

  const NUMERO_DE_PERSONAJES = db.length
  const userTimezoneOffset = new Date().getTimezoneOffset() * 60000

  const dateValue = Math.floor(
    (new Date().getTime() -
      userTimezoneOffset -
      new Date(2024, 0, 1).getTime()) /
      (1000 * 60 * 60 * 24)
  ) //Calculo para tener un dia cada 1

  const todayNumber = dateValue % NUMERO_DE_PERSONAJES
  const yesterdayNumber = todayNumber - 1
  //console.log('AAAAA: ', todayNumber, yesterdayNumber)

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
    if (ch.value == todayNumber + 1) {
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
    localStorage.setItem('clasic-data', JSON.stringify(updatedData))
  }

  //Primera comprobacion
  useLayoutEffect(() => {
    setListaSeleccionable(
      shuffle(
        db.map(x => {
          //Force copy array
          return { ...x }
        })
      )
    )
    const rawData = localStorage.getItem('clasic-data')
    const cGameData = JSON.parse(rawData) || {
      win: false,
      win_ch: '',
      tries: [],
      streak: 0,
      total: 0
    }
    //console.log(cGameData)
    if (cGameData.win == md5(todayNumber + 1)) {
      setGameData(cGameData)
      setGanado(cGameData.win == md5(todayNumber + 1))
      setListaUsados(cGameData.tries)
    } else if (cGameData.win_ch == md5(todayNumber + 1)) {
      setListaUsados(cGameData.tries)
      setGameData(cGameData)
    } else {
      setGameData({ ...cGameData, tries: [], win_ch: md5(todayNumber + 1) })
    }
  }, [])

  const analytics = getAnalytics(firebaseApp())
  useEffect(() => {
    if (ganado) {
      setTimeout(() => {
        modalWin.current.showModal()
        logEvent(analytics, 'win clasic', {
          content_type: 'WIN',
          content_id: 'CL101',
          description: 'User win clasic game'
        })
      }, 3000)
    }
  }, [ganado])

  return (
    <>
      <header className='w-full flex flex-col justify-between items-center gap-5'>
        <Head />
        <SmallModeList />
        <div
          className='text-center px-5 py-3 rounded-3xl mx-3 text-white
         backdrop-blur-sm backdrop-brightness-[80%]  max-w-xl up-flat'
        >
          <h2 className='text-3xl font-black'>{t('gameDisplay.title')}</h2>
          <p className='mt-3'>{t('gameDisplay.smallText')}</p>
        </div>
      </header>
      <main className='flex flex-col justify-center items-center gap-5 my-5'>
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
              {t('win.congratsClassic')}
            </h1>
            <div className='flex flex-row gap-5 justify-center mt-8'>
              <img
                className='rounded-xl border-2 aspect-square h-[100px]'
                src={'ch-faces/' + (todayNumber + 1) + '.webp'}
                width={100}
                height={100}
              />
              <div>
                <h2 className='text-2xl font-semibold '>
                  {t('data.names.' + (todayNumber + 1))}
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
        {!ganado && (
          <div className='w-full max-w-96 px-3'>
            <Select
              aria-label='Seleccinonar personaje'
              className=''
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
        <div className='text-white p-2 px-4 rounded-2xl backdrop-brightness-[80%] up-flat'>
          <p>
            {' '}
            {t('clasic.yesterdayCharacter')}{' '}
            {t('data.names.' + (yesterdayNumber + 1))}
          </p>
        </div>
        <GameTable selectedCh={listaUsados} todayCh={db[todayNumber]} />

        <Tutorial />
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default Clasic

function GameTable ({ selectedCh, todayCh }) {
  const { t } = useTranslation('global')
  const getSerieDireccion = (check, correcto) => {
    const res = check > correcto ? 'abajo' : 'arriba'
    return check === correcto ? undefined : res
  }
  const getArcoDireccion = (check, correcto) => {
    const res = check > correcto ? 'abajo' : 'arriba'
    return check === correcto ? undefined : res
  }
  const getCapituloDireccion = (check, correcto) => {
    const res = check > correcto ? 'abajo' : 'arriba'
    return check === correcto ? undefined : res
  }

  const getRazaSemibien = (check, correcto) => {
    switch (correcto) {
      case 2:
        return check === 1 || check === 15
      case 17:
        return check === 15 || check === 16
      case 21:
        return check === 22
      case 23:
        return check === 22
      case 24:
        return check === 22 || check === 16 || check === 21
      default:
        return false
    }
  }
  const getPeloSemibien = (check, correcto) => {
    switch (correcto) {
      case 7:
        return check === 10 || check === 6
      case 11:
        return check === 1 || check === 4
      case 13:
        return check === 3 || check === 10
      case 15:
        return check === 1 || check === 16
      case 18:
        return check === 6 || check === 2
      case 19:
        return check === 10
      case 20:
        return check === 6 || check === 21
      default:
        return false
    }
  }

  useLayoutEffect(() => {
    selectedCh.length > 0 &&
      gsap.fromTo(
        '.entrada',
        {
          y: '-200%'
        },
        { y: 0, duration: 0.6, delay: 0.25, ease: 'expo.out', stagger: -0.3 }
      )
    selectedCh.length > 1 &&
      gsap.fromTo(
        '.abajo',
        {
          y: '-100%'
        },
        { y: 0, duration: 0.5, ease: 'expo.out' }
      )
  }, [selectedCh])

  return (
    <div className='w-full max-w-4xl overflow-x-scroll px-3 '>
      <div
        className='mx-auto rounded-3xl backdrop-blur-lg backdrop-brightness-[80%] text-shadow-lg
       p-4 grid grid-cols-8 grid-rows-subgrid text-center text-white gap-3 min-w-max w-max up-flat'
      >
        <p>{t('tableTitles.ch')} </p>
        <p> {t('tableTitles.sex')} </p>
        <p> {t('tableTitles.hair')} </p>
        <p> {t('tableTitles.origin')}</p>
        <p> {t('tableTitles.race')} </p>
        <p> {t('tableTitles.chap')} </p>
        <p> {t('tableTitles.saga')} </p>
        <p> {t('tableTitles.serie')} </p>
        {selectedCh.map((character, i) => (
          <>
            <GameIndicator
              animation={i == 0}
              correct={character.id === todayCh.id ? true : false}
              img={" url('ch-faces/" + character.id + ".webp')"}
            />
            <GameIndicator
              animation={i == 0}
              correct={character.genero === todayCh.genero ? true : false}
              name={t('data.genero.' + character.genero.toString())}
            />

            <GameIndicator
              animation={i == 0}
              correct={character.pelo === todayCh.pelo ? true : false}
              semicorrect={getPeloSemibien(character.pelo, todayCh.pelo)}
              name={t('data.pelo.' + character.pelo.toString())}
            />
            <GameIndicator
              animation={i == 0}
              correct={
                character.procedencia === todayCh.procedencia ? true : false
              }
              name={t('data.procedencia.' + character.procedencia.toString())}
            />
            <GameIndicator
              animation={i == 0}
              semicorrect={getRazaSemibien(character.raza, todayCh.raza)}
              correct={character.raza === todayCh.raza ? true : false}
              name={t('data.raza.' + character.raza.toString())}
            />
            <GameIndicator
              animation={i == 0}
              direccion={
                character.serie === todayCh.serie &&
                character.saga === todayCh.saga
                  ? getCapituloDireccion(
                      parseInt(character.episodioAparicion),
                      parseInt(todayCh.episodioAparicion)
                    )
                  : undefined
              }
              correct={
                character.episodioAparicion === todayCh.episodioAparicion &&
                character.serie === todayCh.serie &&
                character.saga === todayCh.saga
                  ? true
                  : false
              }
              name={character.episodioAparicion}
            />

            <GameIndicator
              animation={i == 0}
              correct={
                character.serie === todayCh.serie &&
                character.saga === todayCh.saga
                  ? true
                  : false
              }
              direccion={
                character.serie === todayCh.serie
                  ? getArcoDireccion(character.saga, todayCh.saga)
                  : undefined
              }
              name={t(
                'data.serie.' +
                  character.serie.toString() +
                  '.' +
                  character.saga.toString()
              )}
            />

            <GameIndicator
              animation={i == 0}
              correct={character.serie === todayCh.serie ? true : false}
              direccion={getSerieDireccion(character.serie, todayCh.serie)}
              name={t('data.serie.' + character.serie.toString() + '.nombre')}
            />
          </>
        ))}
      </div>
    </div>
  )
}

const GameIndicator = ({
  semicorrect = false,
  correct = false,
  direccion = null,
  name,
  img,
  animation //TODO: ANIMACION AL ENTRAR GSAP?
}) => {
  const borderColor = semicorrect
    ? 'border-yellow-600'
    : !correct
    ? 'border-red-600'
    : 'border-green-600'
  const insideColor = semicorrect
    ? 'bg-yellow-400'
    : !correct
    ? 'bg-red-400'
    : 'bg-green-400'
  const degradado =
    direccion === 'arriba'
      ? 'bg-[linear-gradient(#05df72,#ff6467)]'
      : 'bg-[linear-gradient(#ff6467,#05df72)]'

  const bg = img ? img : direccion ? degradado : insideColor

  return (
    <div className={animation ? 'entrada' : 'abajo'}>
      <div
        className={`size-20 m-auto border-2 p-0.5 rounded-xl 
            ${borderColor} ${bg} bg-no-repeat bg-cover 
            flex items-center justify-center text-[13px] font-bold overflow-clip`}
        style={{
          backgroundImage: img
        }}
      >
        {name && <p className='w-fit h-min m-auto text-shadow-none'>{name}</p>}
      </div>
    </div>
  )
}

function shuffle (a) {
  if (a != undefined) {
    //console.log('Original: ', a.length)
    let currentIndex = a.length
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[a[currentIndex], a[randomIndex]] = [a[randomIndex], a[currentIndex]]
    }
    //console.log('Shuffle: ', a.length)
    return a
  } else {
    return a
  }
}
