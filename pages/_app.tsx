import '../styles.css'
import Script from 'next/script'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script strategy="beforeInteractive" src="https://db.kupujod.org.ua/" />
      <Component {...pageProps} />
    </>
  )
}
