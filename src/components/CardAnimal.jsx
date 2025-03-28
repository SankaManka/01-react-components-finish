import { useEffect } from 'react';
import '../index.css';

export default function CardAnimal({ position, total }) {
    // Анимация для распределения карт
    const getRotation = () => {
        const middle = total / 2;
        return (position - middle) * 2;
    };

    return (
        <div className="card-animal">
            <div className="card-back"></div>
        </div>
    );
}