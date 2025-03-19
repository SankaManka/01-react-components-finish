import logo from '/logo-name.svg'

export default function Header() {
    const now = new Date()
    // const name = 'Result'
    return (
      <header>
        <img src={logo} alt={'Result'} />
        {/* <h3>Evolution</h3> */}
        <span>Time now: {now.toLocaleTimeString()}</span>
      </header>
    )
  }
