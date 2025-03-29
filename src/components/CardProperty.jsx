export default function CardProperty({ 
    name, 
    description, 
    foodValue, 
    isPredator,
    isSelected,
    onClick
}) {
    const cardName = name || 'Неизвестная карта';
    const cardDescription = description || 'Описание отсутствует';
    const displayFood = Number.isInteger(foodValue) ? foodValue : 0;

    return (
        <div 
            className={`card-property ${isPredator ? 'predator' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <section className='card-name-container'>
                {displayFood > 0 && <div className='food-value'>🍗 {displayFood}</div>}
                <p className='card-name'>{cardName.toUpperCase()}</p>
            </section>
            <section className='card-description-container'>
                <p className='card-description'>{cardDescription}</p>
            </section>
            {isPredator && <div className='predator-badge'>ХИЩНИК</div>}
        </div>
    );
}
