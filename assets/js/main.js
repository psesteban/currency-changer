const api = "https://mindicador.cl/api/";

async function getCurrency() {
  try {
    const res = await fetch(api);
    const data = await res.json();
    const dolar = data.dolar["valor"];
    const euro = data.euro["valor"];
    const valores = { us: dolar, eu: euro };
    return valores;
  } catch (e) {
    console.log("algo salio mal en la respuesta de la API");
  }
}

const buttonConvert = document.querySelector("button");
const input = document.getElementById("amount");
const currencyOptions = document.getElementById("currency");
const result = document.querySelector("#result");

buttonConvert.addEventListener("click", async () => {
  if (input.value === "") return;

  try {
    let inputValue = parseInt(input.value);
    const resultado = await operation(inputValue);
    const formatedCurrency = formatCurrency(resultado);
    const localCurrency = inputValue.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
    showResult(localCurrency, formatedCurrency);
  } catch (error) {
    console.error(error, "revisar código en el botón o en el Inner");
    alert(
      "Al mal tiempo buena cara, intentalo nuevamente en otro momento, gracias"
    );
  }
  input.value = "";
});

const showResult = (localCurrency, formatedCurrency) => {
  result.innerHTML = `Result:  ${localCurrency} chilean pesos = ${formatedCurrency}`;
};

const formatCurrency = (resultado) => {
  let currencyFormat = "en-US";
  let currencyZone = "USD";
  let currencyName = "dolar";
  if (currencyOptions.value === "eu") {
    currencyFormat = "es-ES";
    currencyZone = "EUR";
    currencyName = "euro";
  }

  const formatedCurrency = resultado.toLocaleString(currencyFormat, {
    style: "currency",
    currency: currencyZone,
  });

  renderChart(currencyName, currencyZone);
  return formatedCurrency;
};

const operation = async (inputValue) => {
  let valores = await getCurrency();
console.log (inputValue)
console.log (valores[currencyOptions.value])
  return inputValue / valores[currencyOptions.value];
};

async function renderChart(currency, zone) {
  try {
    const response = await fetch(`https://mindicador.cl/api/${currency}`);
    const data = await response.json();
    const last10DaysData = data.serie.slice(-10);
    const categories = last10DaysData.map((dayData) =>
      new Date(dayData.fecha).toLocaleDateString("es-ES")
    );
    const values = last10DaysData.map((dayData) => dayData.valor);

    Highcharts.chart("chart", {
      title: {
        text: "Exchange Rate",
      },
      xAxis: {
        categories: categories,
      },
      yAxis: {
        title: {
          text: `Exchange Rate ${zone}`,
        },
      },
      series: [
        {
          name: `Currency ${zone}`,
          data: values,
        },
      ],
    });
  } catch (error) {
    console.error(error, "revisar código en el render Chart");
    alert(
      "Al mal tiempo buena cara, intentalo nuevamente en otro momento, gracias"
    );
  }
}
