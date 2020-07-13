import React from 'react'
import styled from 'styled-components'

export default function Title({title, center}) {
  return (
    <TitleWrapper center={center}>
        <div className="col">
            <h2 className="text-title">{title}</h2>
            <div className="title-underline"></div>
        </div>
    </TitleWrapper>
  )
}

const TitleWrapper = styled.nav`
    text-align:${props => props.center ? "center" : "left"};
    
    .text-title{
        font-size: 1rem;
        padding-top:1rem;
        text-transform:uppercase;
        letter-spacing:var(--mainSpacing);
        color:var(--mainGrey);
    }
    .title-underline{
        height:0.25rem;
        width:7rem;
        background:var(--primaryColor);
        margin: ${props => props.center ? "0 auto" : "0"};
    }
`;