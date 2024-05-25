import React, { useState } from 'react'
import { Map, Marker } from "pigeon-maps"

export default function TheatreMap({ latitude, longitude }: { latitude: number, longitude: number }) {

    const [center, setCenter] = useState([latitude, longitude])
    const [zoom, setZoom] = useState(14);

    return (
        <Map height={300} defaultCenter={[center[0], center[1]]} defaultZoom={zoom}>
            <Marker width={50} anchor={center} />
        </Map>
    );
}
