import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/AuthContext'
import useAuth from '../hooks/useAuth'
import MessageModal from '../components/MessageModal'
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthContext.Provider value={useAuth()}>
      <Layout>
        <MessageModal />
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  )
}

export default MyApp
