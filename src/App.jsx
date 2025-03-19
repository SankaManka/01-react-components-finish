import Header from './components/Header'
import { ways } from './data'
import WayToTeach from './components/WayToTeach'
import { useState } from 'react';
import Register from './components/RegistrationForm';
import Enter from './components/Enter'; // Создай компонент Enter

export default function App() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div>
      <section>
        {isRegister ? <Register toggleForm={() => setIsRegister(false)} /> : <Enter toggleForm={() => setIsRegister(true)} />}
      </section>
    </div>
  )
}