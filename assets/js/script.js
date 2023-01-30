const mensajeError = document.querySelector(".error")
const btnBuscar = document.querySelector("#btn")
const resultado = document.querySelector("#resultado")
const chartDOM = document.getElementById("myChart");

btnBuscar.addEventListener("click", () => {
    let pesosClp = document.querySelector("#monedaNac").value;
    var monedaExtra = document.getElementById("monedaExtra").value;

    if (pesosClp !== "") {
        getMonedas(pesosClp, monedaExtra);

        let chartStatus = Chart.getChart("myChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

    } else {
        alert("Favor ingrese una cantidad");
    }

});

async function getMonedas(pesosClp, monedaExtra) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${monedaExtra}`);
        const monedas = await res.json()
        console.log(monedas)

        resultado.innerHTML = `$${(pesosClp / parseFloat(monedas.serie[0].valor)).toFixed(
            2
        )} ${monedas.nombre}`;

        const monedasUltimosValores = monedas.serie.map((x) => x.valor);

        const diasMonedas = monedas.serie.map((e) => e.fecha.slice(5, 10));

        prepararConfiguracionParaLaGrafica(diasMonedas, monedasUltimosValores);

        return monedas;

    } catch (e) {
        let error = "¡Algo salió mal! Error: " + (e.message);
        mensajeError.innerHTML = error;
    }

}

function prepararConfiguracionParaLaGrafica(param1, param2) {
    const tipoDeGrafica = "line";
    const titulo = "Valor de la moneda en los últimos días";
    const colorDeLinea = "#d32f2f";

    let dias = param1.slice(0, 10).reverse();
    console.log(dias);
    let valores = param2.slice(0, 10).reverse();
    console.log(valores);

    const configMonedas = {
        type: tipoDeGrafica,
        data: {
            labels: dias,
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    data: valores,
                }
            ]
        }
    };

    const config = configMonedas;

    new Chart(chartDOM, config);
}