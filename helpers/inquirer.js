require('colors');
const inquirer = require('inquirer');
const arrayPreguntas = [
    {
        value: 1,
        name: `${'1.'.green} Buscar ciudad`,
    },
    {
        value: 2,
        name: `${'2.'.green} Historial de busquedas`,
    },
    {
        value: 0,
        name: `${'0.'.green} salir`,
    },
];

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: arrayPreguntas,
    },
];

const pausa = [
    {
        type: 'input',
        name: 'pausa',
        message: `Presione ${'ENTER'.green} para continuar`,
    },
];

const inquirerMenu = async () => {
    console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opción');
    console.log('=========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
};

const inquirerPausa = async () => {
    console.log('\n');
    await inquirer.prompt(pausa);
};

const inquirerLeerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }

                return true;
            },
        },
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
};

const listarLugares = async (lugares = []) => {
    const choices = lugares.map((l, idx) => {
        const i = `${idx + 1}`;

        return {
            value: l.id,
            name: `${i.green}. ${l.nombre}`,
        };
    });

    choices.unshift({
        value: '0',
        name: '0 Cancelar',
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices,
        },
    ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
};

const confirmar = async (msg) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message: msg,
        },
    ];

    const { ok } = await inquirer.prompt(question);

    return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
    const choices = tareas.map((t, idx) => {
        const i = `${idx + 1}`;

        return {
            value: t.id,
            name: `${i} ${t.desc}`,
            checked: t.completado ? true : false,
        };
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices,
        },
    ];

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
};

module.exports = {
    inquirerMenu,
    inquirerPausa,
    inquirerLeerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist,
};
