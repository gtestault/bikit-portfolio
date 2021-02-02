import "./Gallery.css"
import ImageGallery from 'react-image-gallery';
import React from "react"

const imageNameList = [
    "tunnel1",
    "tunnel2",
    "app",
    "backlight",
    "bag",
    "front",
    "laser",
    "lidar",
    "outside",
    "outside2",
    "tunnel3",
    "tunnel4",
    "ultrasonic1",
    "ultrasonic2",
]


const images = imageNameList.map((imageName) => (
    {
        original: process.env.PUBLIC_URL + "/img/" + imageName + ".jpg",
        thumbnail: process.env.PUBLIC_URL + "/img/thumb/" + imageName + ".jpg"
    }
))

/*
    [
    {
        original: process.env.PUBLIC_URL + "/img/tunnel.jpg",
        thumbnail: process.env.PUBLIC_URL + "/img/tunnel.jpg",
    },
];
*/
const Gallery = () => {
    console.log(images)
    return (
        <div className="galleryContainer">
            <ImageGallery items={images}/>
        </div>
    )
}

export default Gallery
