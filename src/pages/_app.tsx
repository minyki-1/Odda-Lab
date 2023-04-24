import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { GlobalStyle } from '../css/globals';
import Script from 'next/script'

const font = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html { font-family: ${font.style.fontFamily}; }
      `}</style>
      <GlobalStyle />
      <Script src="//cdn.jsdelivr.net/npm/eruda" />
      <script>eruda.init();</script>
      <Component {...pageProps} />
    </>
  )
}
