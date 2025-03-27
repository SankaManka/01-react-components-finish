import '../index.css';

export default function CardProperty() {
    return (
        <div className="card-property">
            <section className='card-name-container'><p className='card-name'>ВОДОПЛАВАЮЩЕЕ</p></section>
            <section className='card-descripion-container'>
                <p className='card-descripion'>может быть атаковано только хищником
                со свойством ВОДОПЛАВАЮЩЕЕ. 
                Хищник со свойством ВОДОПЛАВАЮЩЕЕ не может атаковать без свойства ВОДОПЛАВАЮЩЕЕ</p>
            </section>
        </div>
    );
}