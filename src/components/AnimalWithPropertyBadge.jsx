import CardAnimal from "./CardAnimal";
import '../index.css';

export default function AnimalWithPropertyBadge({ id, food, properties, onClick }) {
  return (
    <div className="animal-with-property-badge">
      {properties && properties.length > 0 && (
        <div className="property-name-container">
          {properties.map((prop, index) => (
              <div
                  className={`property-name 
                    ${prop.name === 'Топотун' ? 'topatun' : ''} 
                    ${prop.name === 'Спячка' ? 'spyachka' : ''}
                    ${prop.name === 'Хищник' ? 'predator' : ''}`}
                  key={index}
              >
                  {prop.name}
              </div>
          ))}
        </div>
      )}
        <div onClick={onClick}>
            <CardAnimal id={id} food={food}/>
        </div>
    </div>
  );
}
