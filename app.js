const {
    inquirerLeerInput,
    inquirerMenu,
    inquirerPausa,
    listarLugares,
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
const OpcionesMenu = require('./models/opcionesMenu');

const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case OpcionesMenu.BUSCAR_CIUDAD:
                // mostrar mensaje
                const termino = await inquirerLeerInput('Ciudad: ');
                // buscar las ciudad
                const lugares = await busquedas.getCiudades(termino);
                // seleccionar la ciudad
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                // guardar en db
                const lugarSeleccionado = lugares.find((l) => l.id === id);
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                // clima
                const climaLugar = await busquedas.getClimaPorLugar(
                    lugarSeleccionado.lat,
                    lugarSeleccionado.lng
                );
                // mostrar resultado
                busquedas.mostrarResultado(lugarSeleccionado, climaLugar);
                break;
            case OpcionesMenu.HISTORIAL:
                busquedas.mostrarHisotrial();
                break;
            default:
                break;
        }

        if (opt !== 0) await inquirerPausa();
    } while (opt !== 0);
};

main();
