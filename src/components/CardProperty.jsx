import PropTypes from 'prop-types';
import '../index.css';

export default function CardProperty({
  name = 'Неизвестная карта',
  description = 'Описание отсутствует',
  foodValue = 0,
  isPredator = false,
  isSelected = false,
  onClick = () => {}
}) {
  const displayFood = Number.isInteger(foodValue) ? foodValue : 0;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      className={`card-property ${isPredator ? 'predator' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      title={description}
      role="button"
    >
      <section className="card-name-container">
        {displayFood > 0 && <div className="food-value">🍗 {displayFood}</div>}
        <p className="card-name">{name.toUpperCase()}</p>
      </section>
      <section className="card-description-container">
        <p className="card-description">{description}</p>
      </section>
      {isPredator && <div className="predator-badge">ХИЩНИК</div>}
    </div>
  );
}

CardProperty.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  foodValue: PropTypes.number,
  isPredator: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};
