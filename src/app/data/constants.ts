// Most constants are available in the following links:
// * https://www.bps.gub.uy/5478/valores-actuales.html
// * https://www.bps.gub.uy/5479/valores-historicos.html

/**
 * Valor BPC.
 */
const BPC = new Map([
  [2024, 6.177],
  [2023, 5.66],
  [2022, 5.164],
  [2021, 4.87],
  [2020, 4.519],
  [2019, 4.154],
  [2018, 3.848],
  [2017, 3.611],
  [2016, 3.34],
  [2015, 3.052],
  [2014, 2.819],
  [2013, 2.598],
  [2012, 2.417],
  [2011, 2.226],
  [2010, 2.061],
  [2009, 1.944],
  [2008, 1.775],
  [2007, 1.636],
  [2006, 1.482],
])

/**
 * Franjas de IPRF.
 *  - 'desde' y 'hasta' son los valores en BPC en los que está comprendida la franja.
 *
 *    El valor de 'desde' está dentro de la franja, el de 'hasta' no.
 *
 *    La última franja tiene valor 0 en "hasta".
 *  - 'tasa' es el porcentaje del impuesto.
 */
const IRPF_FRANJAS = [
  { desde: 0, hasta: 7, tasa: 0 },
  { desde: 7, hasta: 10, tasa: 10 },
  { desde: 10, hasta: 15, tasa: 15 },
  { desde: 15, hasta: 30, tasa: 24 },
  { desde: 30, hasta: 50, tasa: 25 },
  { desde: 50, hasta: 75, tasa: 27 },
  { desde: 75, hasta: 115, tasa: 31 },
  { desde: 115, hasta: 0, tasa: 36 },
]

/**
 * Porcentaje de aportes jubilatorios.
 */
const APORTES_JUBILATORIOS = 15

/**
 * Maximo del salario nominal sobre el cual aplican los aportes jubilatorios.
 */
const TOPE_APORTES_JUBILATORIOS = new Map([
  [2023, 236_309],
  [2022, 215_179],
  [2021, 202_693],
  [2020, 188_411],
  [2019, 173_539],
  [2018, 160_121],
  [2017, 146_859],
])

/**
 * Porcentaje de aportes FONASA para personas con salario hasta a 2.5 BPC.
 */
const APORTES_FONASA_HASTA25BPC = { base: 3, conyuge: 2, hijos: 0 }
/**
 * Porcentaje de aportes FONASA para personas con salario mayor a 2.5 BPC.
 */
const APORTES_FONASA_DESDE25BPC = { base: 4.5, conyuge: 2, hijos: 1.5 }

/**
 * Porcentaje de aporte FRL.
 */
const APORTE_FRL = 0.1

/**
 * Tope AFAP.
 */
const TOPE_AFAP = new Map([
  [2023, 236_309],
  [2022, 215_179],
])

/**
 * Porcentaje de incremento de ingresos gravados que aplica si la renta computable es mayor a 10 BPC.
 */
const INCREMENTO_INGRESOS_GRAVADOS = 6

/**
 * Porcentaje de deducciones de IRPF para personas con salario hasta 15 BPC.
 */
const TASA_DEDUCCIONES_HASTA15BPC = 10
/**
 * Porcentaje de deducciones de IRPF para personas con salario desde 15 BPC.
 */
const TASA_DEDUCCIONES_DESDE15BPC = 8

/**
 * Cantidad deducida del IRPF por cada hijo sin discapacidad.
 */
const DEDUCCION_HIJO_SIN_DISCAPACIDAD = (year: number) =>
  BPC.get(year) ?? 0 > 0 ? (13 * BPC.get(year)!) / 12 : undefined
/**
 * Cantidad deducida del IRPF por cada hijo con discapacidad.
 */
const DEDUCCION_HIJO_CON_DISCAPACIDAD = (year: number) =>
  BPC.get(year) ?? 0 > 0 ? (26 * BPC.get(year)!) / 12 : undefined

/**
 * Adicional al fondo de solidaridad que debe pagarse en carreras de duracion igual o mayor
 * a cinco años.
 */
const ADICIONAL_FONDO_SOLIDARIDAD = (year: number) =>
  BPC.get(year) ?? 0 > 0 ? ((5 / 3) * BPC.get(year)!) / 12 : undefined

/**
 * Format string to be used by numeral, when formatting numbers.
 * @type {string}
 */
const NUMERAL_FORMAT_STRING: string = "(0,0.[00])"
/**
 * Format string to be used by numeral, when formatting currency.
 * @type {string}
 */
const NUMERAL_CURRENCY_FORMAT_STRING: string = `$ ${NUMERAL_FORMAT_STRING}`

export {
  ADICIONAL_FONDO_SOLIDARIDAD,
  APORTES_FONASA_DESDE25BPC,
  APORTES_FONASA_HASTA25BPC,
  APORTES_JUBILATORIOS,
  APORTE_FRL,
  BPC,
  DEDUCCION_HIJO_CON_DISCAPACIDAD,
  DEDUCCION_HIJO_SIN_DISCAPACIDAD,
  INCREMENTO_INGRESOS_GRAVADOS,
  IRPF_FRANJAS,
  NUMERAL_CURRENCY_FORMAT_STRING,
  NUMERAL_FORMAT_STRING,
  TASA_DEDUCCIONES_DESDE15BPC,
  TASA_DEDUCCIONES_HASTA15BPC,
  TOPE_AFAP,
  TOPE_APORTES_JUBILATORIOS,
}
