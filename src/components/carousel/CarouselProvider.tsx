import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./CarouselProvider.css";

type IProp={
  imagesArr: string[],
  showIndicators?:boolean
}

function CarouselProvider(prop:IProp) {
  return (
    <Carousel showIndicators={prop.showIndicators || false} showThumbs={prop.showIndicators || false}  autoPlay={true} interval={2000} infiniteLoop={true}>
      {prop.imagesArr.map((image:string,index:number) => {
        return <div key={index} className="caurousel-img">
        <img className="img-cover" src={image} alt={`Carousel Home ${index+1}`} />
      </div>
      })}
      </Carousel>
  );
}

export default CarouselProvider;
