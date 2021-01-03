import React from 'react'
import { propTypes } from 'react-bootstrap/esm/Image';

export default function Rating({ value, text, color = 'Orange' }) {
    return (
        <div className='rating'>
            {stars(value, color)}
            <span>{text && text}</span>
        </div>
    )
}

function stars(rating, color){
    const stars = [];

    while (stars.length < 5){
        let star;
        
        if (rating > 0.75)
            star = 'fas fa-star'
        else if (rating > 0.25)
            star = 'fas fa-star-half-alt';
        else
            star = 'far fa-star'

        stars.push(<span key={stars.length + 1}>
            <i
                className={star}
                style={{color: color}}
            >
            </i></span>);
        
        rating -= 1
    }

    return stars
}