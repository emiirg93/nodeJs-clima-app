const fs = require('fs');

require('dotenv').config();
const { default: axios } = require('axios');
const { inquirerPausa } = require('../helpers/inquirer');

class Busquedas {
    historial = [];
    path = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            lenguage: 'es',
        };
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWHEATHER_KEY,
            units: 'metric',
            lang: 'es',
        };
    }

    async getCiudades(lugar = '') {
        try {
            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapbox,
            });

            const resp = await intance.get();
            return resp.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async getClimaPorLugar(lat, lon) {
        try {
            const intance = axios.create({
                baseURL: 'http://api.openweathermap.org/data/2.5/weather?',
                params: { ...this.paramsOpenWeather, lat, lon },
            });

            const resp = await intance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };
        } catch (error) {
            console.log(error);
        }
    }

    mostrarResultado(lugarSeleccionado, climaLugar) {
        console.clear();
        console.log('\nInformación de la ciudad\n'.green);
        console.log('Ciudad:', lugarSeleccionado.nombre);
        console.log('Lat:', lugarSeleccionado.lat);
        console.log('Lng:', lugarSeleccionado.lng);
        console.log('Temperatura:', climaLugar.temp);
        console.log('Min:', climaLugar.min);
        console.log('Max:', climaLugar.max);
        console.log('Estado del clima:', `${climaLugar.desc}`.green);
    }

    agregarHistorial(lugar = '') {
        //prevenir duplicados.
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync(this.path, JSON.stringify(payload));
    }

    leerDB() {
        if (fs.existsSync(this.path)) {
            const archivoDB = fs.readFileSync(this.path, { encoding: 'utf-8' });
            const data = JSON.parse(archivoDB);

            this.historial = data.historial;
        }
    }

    mostrarHisotrial() {
        return this.historial.forEach((lugar, i) => {
            console.log(this.capitalize(`${i + 1}`.green + ` ${lugar}`));
        });
    }

    capitalize(string = '') {
        return string
            .trim()
            .toLowerCase()
            .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
    }
}

module.exports = Busquedas;
