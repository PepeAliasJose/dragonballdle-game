import {
  ArrowUpIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useLayoutEffect, useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

const Tutorial = () => {
  const { t } = useTranslation('global')
  const [hidden, setHidden] = useState(false)

  function hideTutorial () {
    setHidden(true)
  }

  return (
    <div className={hidden && 'hidden'}>
      <div className='p-4 rounded-2xl bg-gray-100 w-fit flex flex-col gap-4 mx-3 up-flat'>
        <div className='w-full inline-flex justify-between items-center'>
          <p>{t('learn.title')}</p>
          <button
            onClick={hideTutorial}
            aria-label='Cerrar indicadores'
            className='p-1 rounded-full border-[1px]'
          >
            <XMarkIcon className='size-5 ' />
          </button>
        </div>
        <div className='grid grid-cols-5 grid-rows-subgrid gap-2 text-center'>
          <div className='size-14 md:size-18 bg-green-400 rounded-xl m-auto' />
          <div className='size-14 md:size-18 bg-red-400 rounded-xl m-auto' />
          <div className='size-14 md:size-18 bg-yellow-400 rounded-xl m-auto' />
          <div
            className='size-14 md:size-18 bg-[linear-gradient(#05df72,#ff6467)] rounded-xl m-auto
          flex items-center justify-center'
          >
            <div>
              <ChevronDoubleUpIcon className='text-white size-10 md:size-14 ' />
            </div>
          </div>
          <div
            className='size-14 md:size-18 bg-[linear-gradient(#ff6467,#05df72)] rounded-xl m-auto
          flex items-center justify-center'
          >
            <div>
              <ChevronDoubleDownIcon className='text-white size-10 md:size-14 ' />
            </div>
          </div>
          <p className='text-sm'>{t('learn.true')}</p>
          <p className='text-sm'>{t('learn.false')}</p>
          <p className='text-sm'>{t('learn.med')}</p>
          <p className='text-sm'>{t('learn.new')}</p>
          <p className='text-sm'>{t('learn.old')}</p>
        </div>
      </div>
    </div>
  )
}
export default Tutorial
