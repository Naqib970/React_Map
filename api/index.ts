import axios from "axios";
const API_KEY = "";

export const fetchPlaces = (query:string) => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${API_KEY}`
    );
};

export const fetchgeoLocation = (place_id:string) => {
    return axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}`
    );
};
