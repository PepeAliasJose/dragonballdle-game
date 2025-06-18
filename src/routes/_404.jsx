import Footer from '../components/Footer'
import Head from '../components/Head'
import SmallModeList from '../components/SmallModeList'

function NotFound () {
  return (
    <>
      <header className='w-full flex flex-col justify-between items-center gap-5 px-3'>
        <Head />
        <SmallModeList />
      </header>
      <main className='flex flex-col justify-center items-center gap-5 my-5'>
        <p className='text-9xl text-white font-bold'>404</p>
        <img
          src='db-resources/goku-404.webp'
          width={300}
          height={168}
          alt='goku 404'
        />
      </main>
      <footer className='w-full flex flex-col justify-between items-center '>
        <Footer />
      </footer>
    </>
  )
}

export default NotFound
