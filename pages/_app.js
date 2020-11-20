import '../styles/normalize.css'
import '../styles/style.css'
import '../styles/fonts/stylesheet.css'

function MyApp({Component, pageProps}) {
  return <>
    <div id='root'>
      <Component {...pageProps} />
    </div>
    <style jsx global>{`
      #root {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin-top: -40px;
      }
     `}</style>
  </>
}

export default MyApp
