import '../index.css';

export default function FoodChip({ currentFood }) {
  return (
    <div className='food-chip-container'>
      <div className='food-chip'></div>
      <span>{currentFood ?? '—'}</span>
    </div>
  );
}
