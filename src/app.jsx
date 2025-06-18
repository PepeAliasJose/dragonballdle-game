import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route
} from 'preact-iso'

import Home from './routes/Index'
const Clasic = lazy(() => import('./routes/Clasic'))
const Shadow = lazy(() => import('./routes/Shadow'))
const Boo = lazy(() => import('./routes/Boo'))
const Speed = lazy(() => import('./routes/Speed'))
const Info = lazy(() => import('./routes/Information'))
const NotFound = lazy(() => import('./routes/_404'))

export function App () {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <div className='fixed flex flex-row justify-between w-full h-[100dvh] -z-50 pointer-events-none'>
          <div className='w-0 md:w-96'>
            <img
              className='mascaraImagen2 -mt-[10%] -ml-[15%]'
              width={'100%'}
              alt='vegeta'
              src='db-resources/VegettaIz.webp'
            />
          </div>
          <div className='w-0 md:w-96 '>
            <img
              className='ml-auto'
              width={'90%'}
              alt='gokussj'
              src='db-resources/GokussjDer.webp'
            />
          </div>
        </div>
        <Router>
          <Home path='/' />
          <Clasic path='/clasic' />
          <Shadow path='/shadow' />
          <Boo path='/buu' />
          <Speed path='/speed' />
          <Info path='/info' />
          {/* `default` prop indicates a fallback route. Useful for 404 pages */}
          <NotFound default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
