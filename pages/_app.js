import '../styles/normalize.css'
import '../styles/style.css'

function MyApp({Component, pageProps}) {
    return <div id='root'>
        <Component {...pageProps} />
    </div>
}

export default MyApp
