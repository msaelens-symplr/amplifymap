import "./App.scss";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { initializeMap } from "./mapping";
import { Flex, Heading } from "@aws-amplify/ui-react";
import MapLegend from "./MapLegend";
import maplibregl from "maplibre-gl";

function App() {
    const [map, setMap] = useState<maplibregl.Map | null>(null);

    useEffect(() => {
        async function initMap() {
            setMap(await initializeMap());
        }
        initMap();
    }, []);

    return (
        <>
            <Flex
                className='top-navbar'
                direction='row'
                justifyContent='flex-start'
                alignItems='stretch'
                alignContent='flex-start'
                wrap='nowrap'
                gap='1rem'>
                <Heading level={5}>sLearning Clients</Heading>
            </Flex>
            <MapLegend map={map}></MapLegend>
            <div id='map'></div>
        </>
    );
}

export default App;
