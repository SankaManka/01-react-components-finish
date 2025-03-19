import ReactDOM from 'react-dom/client'
import './index.css'
import RulesModal from './components/RulesModal'

const footer = document.getElementById('footer')

const lobbies = document.getElementById('lobbiesContainer')

ReactDOM.createRoot(footer).render(<RulesModal />)
