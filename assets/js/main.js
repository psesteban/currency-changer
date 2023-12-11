
async function getCurrency() {
    try {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();
    const dolar = data.dolar['valor'];
    const euro = data.euro['valor'];
    const valores = {us: dolar, eu: euro};
    return valores

    } catch (e) {
console.log("algo salio mal")
    }
    }

const buttonConvert = document.querySelector('button');
const input = document.getElementById("amount");
const currencyOptions = document.getElementById("currency")
const result = document.querySelector("#result");


buttonConvert.addEventListener("click", async () => {
    if (input.value === "") return;
    let inputValue = input.value.replace(/\D/g, '');

    try {
        const resultado = await operation(inputValue);
        result.innerHTML = resultado;
        input.value = "";
    } catch (error) {
        console.error(error);
    }
});

const operation = async(inputValue) => {
    let valores = await getCurrency()
    let currencyFormat = 'en-US'
    let currencyZone = 'USD'
    let currencyName = 'dolar'
    if (currencyOptions.value === 'eu') {
        currencyFormat = 'es-ES'
        currencyZone = 'EUR'
        currencyName = 'euro'
    } 
    renderChart(currencyName, currencyZone)

   return (inputValue / valores[currencyOptions.value]).toLocaleString(currencyFormat, {
    style: 'currency',
    currency: currencyZone
  });

}

async function renderChart(currency, zone) {
    try {
      const response = await fetch(`https://mindicador.cl/api/${currency}`);
      const data = await response.json();
      const last10DaysData = data.serie.slice(-10);
      const categories = last10DaysData.map(dayData => new Date(dayData.fecha).toLocaleDateString('es-ES'));
      const values = last10DaysData.map(dayData => dayData.valor);
      
      Highcharts.chart('chart', {
        title: {
          text: 'Exchange Rate'
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: `Exchange Rate ${zone}`
          }
        },
        series: [{
          name: `Currency ${zone}`,
          data: values
        }]
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  