import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import RulesModal from './components/RulesModal'

const footer = document.getElementById('footer')

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(<App />)

ReactDOM.createRoot(footer).render(<RulesModal />)
