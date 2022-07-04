import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/AuthContext'
import useAuth from '../lib/useAuth'
function MyApp({ Component, pageProps }: AppProps) {
  const authData = useAuth();
  return (
    <AuthContext.Provider value={authData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  )
}

export default MyApp
