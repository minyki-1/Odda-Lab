import type { AppProps } from 'next/app'
import { Lato, Noto_Sans_KR } from '@next/font/google'
import { GlobalStyle } from '../css/globals';

const font = Lato({
  weight: "400",
  display: "fallback",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html { font-family: ${font.style.fontFamily}; }
      `}</style>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}
