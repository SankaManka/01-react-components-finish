import '../index.css';

export default function Deck({ deckCount }) {
  return (
    <div className='deck-container'>
      <div className="card-animal"></div>
      <span>{deckCount ?? '—'}</span>
    </div>
  );
}
