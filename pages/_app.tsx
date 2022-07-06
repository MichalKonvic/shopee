import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/AuthContext'
import useAuth from '../hooks/useAuth'
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthContext.Provider value={useAuth()}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  )
}

export default MyApp
