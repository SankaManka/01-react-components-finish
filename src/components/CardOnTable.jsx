import { useEffect, useState } from 'react';
import CardAnimal from './CardAnimal';

export default function CardOnTable({ cards }) {
  return (
    <div className="table-grid">
      {cards.map(card => (
        <CardAnimal
          key={card.card_instance_id}
          {...card}
          isOnTable={true}
        />
      ))}
    </div>
  );
}