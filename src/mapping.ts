import location from "aws-sdk/clients/location";
import awsconfig from "./aws-exports";
import geocodedClients from "./data/geocoded-clients.json";
import { createMap } from "maplibre-gl-js-amplify";
import { drawPoints } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";

function getLocationService(credentials: any) {
    return new location({
        credentials: credentials,
        region: awsconfig.aws_project_region,
    });
}

export function geocode(credentials:any, address:string, callback:any) {
    const service = getLocationService(credentials);
    service.searchPlaceIndexForText({
        IndexName: "TBD",
        FilterCountries: ["USA"],
        Text: address,
        Language: "en"
    }, (err, response) => {
        if (err) {
            console.error(err)
        } else if (response && response.Results.length > 0) {
            let locations = [];
            for (let i = 0; i < response.Results.length; i += 1) {
                locations.push(response.Results[i].Place.Geometry.Point)
            }
            callback(locations);
        }
    });
}

function getLocations():any {
    let locations: { title: string; address: string; coordinates: number[]; }[] = [];
    geocodedClients.forEach((client) => {
        const address = `${client.City}, ${client.State}`;
        locations.push({ title: client.Name, address: address, coordinates: [client.lon, client.lat] });
    });
    return locations;
}

function addLocations(map: maplibregl.Map) {
    map.on("load", function () {
        drawPoints(
            "mySourceName", // Arbitrary source name
            getLocations(),
            map,
            {
                showCluster: false,
                unclusteredOptions: {
                    showMarkerPopup: true
                },
                clusterOptions: {
                    showCount: true
                }
            }
        );
    })
}

const BOSTON = {
    latitude: 42.35866,
    longitude: -71.05674
};

export async function initializeMap() {
    const map:maplibregl.Map = await createMap({
        container: "map", // An HTML Element or HTML element ID to render the map in https://maplibre.org/maplibre-gl-js-docs/api/map/
        center: [BOSTON.longitude, BOSTON.latitude],
        zoom: 10
    });
    //const credentials = await Auth.currentCredentials();
    addLocations(map);
    return map;
}