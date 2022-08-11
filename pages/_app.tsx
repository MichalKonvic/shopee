import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { AuthContext } from '../contexts/AuthContext'
import useAuth from '../hooks/useAuth'
import MessageModalProvider from '../components/MessageModalProvider'
import ShoppingCartContext from '../contexts/ShoppingCartContext'
import useShopping from '../hooks/useShopping'
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthContext.Provider value={useAuth()}>
      <ShoppingCartContext.Provider value={useShopping()}>
        <Layout>
          <MessageModalProvider>
            <Component {...pageProps} />
          </MessageModalProvider>
        </Layout>
      </ShoppingCartContext.Provider>
    </AuthContext.Provider>
  )
}

export default MyApp
