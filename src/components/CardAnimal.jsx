import '../index.css';

export default function CardAnimal({ id, food, food_need }) {
  const getRotation = () => {
    // Здесь можно реализовать логику поворота, если понадобится
    return 0;
  };

  return (
    <div className="card-animal" style={{ transform: `rotate(${getRotation()}deg)` }}>
      <div className="card-back">
        <div className="animal-food">
          Еда: {food} / {food_need}
        </div>
      </div>
    </div>
  );
}
