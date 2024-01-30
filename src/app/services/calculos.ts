import {
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
  TASA_DEDUCCIONES_DESDE15BPC,
  TASA_DEDUCCIONES_HASTA15BPC,
  TOPE_APORTES_JUBILATORIOS,
} from "#data/constants"

export interface AportesBPS {
  // Aportes jubilatorios.
  aportesJubilatorios: number
  // Aportes FONASA.
  aportesFONASA: number
  // Aportes FRL.
  aporteFRL: number
}

export interface DetalleIRPF {
  // Arreglo que en la posición i tiene el impuesto a pagar correpondiente a la i-ésima franja de IRPF.
  impuestoFranja: number[]
  // Cantidad de monto a deducir (antes de aplicar la tasa de 8 o 10%).
  deducciones: number
  // Tasa de deducciones IRPF.
  tasaDeducciones: number
}

export interface ImpuestoIRPF {
  // Detalle del IRPF a pagar.
  detalleIRPF: DetalleIRPF
  // Total del IRPF a pagar.
  totalIRPF: number
}

export interface CalculoImpuestosInput {
  anio: number
  salarioNominal: number
  tieneHijos: boolean
  tieneConyuge: boolean
  factorDeduccionPersonasACargo: number
  cantHijosSinDiscapacidad: number
  cantHijosConDiscapacidad: number
  aportesFondoSolidaridad: number
  adicionalFondoSolidaridad: boolean
  aportesCJPPU: number
  otrasDeducciones: number
}

/**
 * Funcion que calcula los aportes al BPS.
 * @param salarioNominal - Salario nominal en pesos.
 * @param tieneHijos - True si tiene hijos a cargo, false en caso contrario.
 * @param tieneConyuge - True si tiene conyuge a cargo, false en caso contrario.
 *
 * @returns {AportesBPS} - Un objeto que tiene los aportes jubilatorios, FONASA y FRL calculados.
 */
export const calcularAportesBPS = (
  anio: number,
  salarioNominal: number,
  tieneHijos: boolean,
  tieneConyuge: boolean
) => {
  // Calcular que valores usar en base al salario nominal en BPC
  const salarioEnBPC = salarioNominal / BPC.get(anio)! // TODO: Check not null
  let valoresFonasa = null
  if (salarioEnBPC > 2.5) valoresFonasa = APORTES_FONASA_DESDE25BPC
  else valoresFonasa = APORTES_FONASA_HASTA25BPC

  // Calcular porcentaje fonasa
  let porcentajeFonasa = valoresFonasa.base
  if (tieneHijos) porcentajeFonasa += valoresFonasa.hijos
  if (tieneConyuge) porcentajeFonasa += valoresFonasa.conyuge

  // Calcular valores de retorno
  const aportesJubilatorios =
    Math.min(TOPE_APORTES_JUBILATORIOS.get(anio)!, salarioNominal) * APORTES_JUBILATORIOS * 0.01 // TODO: Check not null
  const aportesFONASA = salarioNominal * porcentajeFonasa * 0.01
  const aporteFRL = salarioNominal * APORTE_FRL * 0.01

  return { aportesJubilatorios, aportesFONASA, aporteFRL }
}

/**
 *
 * @param salarioNominal - Salario nominal.
 * @param factorDeduccionPersonasACargo - Factor por el que se multiplica la deduccion correspondiente a
 *   las personas a cargo.
 * @param cantHijosSinDiscapacidad - Cantida de hijos sin discapacidad.
 * @param cantHijosConDiscapacidad - Cantida de hijos con discapacidad.
 * @param aportesJubilatorios - Aportes jubilatorios.
 * @param aportesFONASA - Aportes FONASA.
 * @param aporteFRL - Aporte FRL.
 * @param aportesFondoSolidaridad - Cantidad de BPC que se aportan al Fondo de Solidaridad.
 * @param adicionalFondoSolidaridad - True si corresponde aportar adicional al Fondo de Solidaridad.
 * @param aportesCJPPU - Aportes a la Caja de Profesionales Universitarios.
 * @param otrasDeducciones - Otras deducciones.
 *
 * @returns {ImpuestoIRPF} - El monto total de IRPF y los detalles de las distintas franjas y deducciones.
 */
export const calcularIPRF = (
  anio: number,
  salarioNominal: number,
  factorDeduccionPersonasACargo: number,
  cantHijosSinDiscapacidad: number,
  cantHijosConDiscapacidad: number,
  aportesJubilatorios: number,
  aportesFONASA: number,
  aporteFRL: number,
  aportesFondoSolidaridad: number,
  adicionalFondoSolidaridad: boolean,
  aportesCJPPU: number,
  otrasDeducciones: number
): ImpuestoIRPF => {
  // info sobre deducciones
  // https://www.dgi.gub.uy/wdgi/page?2,rentas-de-trabajo-160,preguntas-frecuentes-ampliacion,O,es,0,PAG;CONC;1017;8;D;cuales-son-las-deducciones-personales-admitidas-en-la-liquidacion-del-irpf-33486;3;PAG;
  const salarioEnBPC = salarioNominal / BPC.get(anio)! // TODO: Check not null
  let tasaDeducciones = null
  if (salarioEnBPC > 15) tasaDeducciones = TASA_DEDUCCIONES_DESDE15BPC
  else tasaDeducciones = TASA_DEDUCCIONES_HASTA15BPC

  // Calcular si hay que aplicar el aumento a ingresos gravados Seguridad Social
  if (salarioEnBPC > 10) salarioNominal *= 1 + INCREMENTO_INGRESOS_GRAVADOS * 0.01

  // Cantidad deducida del IRPF por los hijos
  const deduccionesHijos =
    factorDeduccionPersonasACargo *
    (cantHijosSinDiscapacidad * DEDUCCION_HIJO_SIN_DISCAPACIDAD(anio)! +
      cantHijosConDiscapacidad * DEDUCCION_HIJO_CON_DISCAPACIDAD(anio)!) // TODO: Check not null

  const aporteAdicionalFondoSolidaridad = adicionalFondoSolidaridad
    ? ADICIONAL_FONDO_SOLIDARIDAD(anio)! // TODO: Check not null
    : 0

  const deducciones =
    deduccionesHijos +
    aportesJubilatorios +
    aportesFONASA +
    aporteFRL +
    (aportesFondoSolidaridad * BPC.get(anio)!) / 12 + // TODO: Check not null
    aporteAdicionalFondoSolidaridad +
    aportesCJPPU +
    otrasDeducciones

  // Cantidad de impuesto de IRPF de cada franja
  const detalleIRPF: { impuestoFranja: number[]; deducciones: number; tasaDeducciones: number } = {
    impuestoFranja: [],
    deducciones,
    tasaDeducciones,
  }

  IRPF_FRANJAS.forEach((franja) => {
    const hasta = franja.hasta !== 0 ? franja.hasta : 999
    if (salarioNominal > franja.desde * BPC.get(anio)!) {
      // TODO: Check not null
      const impuesto =
        (Math.min(hasta * BPC.get(anio)!, salarioNominal) - franja.desde * BPC.get(anio)!) *
        franja.tasa *
        0.01 // TODO: Check not null
      detalleIRPF.impuestoFranja.push(impuesto)
    } else {
      detalleIRPF.impuestoFranja.push(0)
    }
  })

  const totalIRPF = Math.max(
    0,
    detalleIRPF.impuestoFranja.reduce((a, b) => a + b, 0) - deducciones * tasaDeducciones * 0.01
  )

  return { detalleIRPF, totalIRPF }
}

/**
 * Calcular los impuestos de BPS e IRPF. Los resultados devueltos tienen a lo sumo 2 decimales.
 *
 * @param salarioNominal - Salario nominal en pesos.
 * @param tieneHijos - True si tiene hijos a cargo, false en caso contrario.
 * @param tieneConyuge - True si tiene conyuge a cargo, false en caso contrario.
 * @param factorDeduccionPersonasACargo - Factor por el que se multiplica la deduccion correspondiente a
 *   las personas a cargo.
 * @param cantHijosSinDiscapacidad - Cantida de hijos sin discapacidad.
 * @param cantHijosConDiscapacidad - Cantida de hijos con discapacidad.
 * @param aportesFondoSolidaridad - Cantidad de BPC que se aportan al Fondo de Solidaridad.
 * @param adicionalFondoSolidaridad - True si corresponde aportar adicional al Fondo de Solidaridad.
 * @param aportesCJPPU - Aportes a la Caja de Profesionales Universitarios.
 * @param otrasDeducciones - Otras deducciones.
 *
 */
export const calcularImpuestos = (
  anio: number,
  salarioNominal: number,
  tieneHijos: boolean,
  tieneConyuge: boolean,
  factorDeduccionPersonasACargo: number,
  cantHijosSinDiscapacidad: number,
  cantHijosConDiscapacidad: number,
  aportesFondoSolidaridad: number,
  adicionalFondoSolidaridad: boolean,
  aportesCJPPU: number,
  otrasDeducciones: number
) => {
  const { aportesJubilatorios, aportesFONASA, aporteFRL } = calcularAportesBPS(
    anio,
    salarioNominal,
    tieneHijos,
    tieneConyuge
  )

  const { detalleIRPF, totalIRPF } = calcularIPRF(
    anio,
    salarioNominal,
    factorDeduccionPersonasACargo,
    cantHijosSinDiscapacidad,
    cantHijosConDiscapacidad,
    aportesJubilatorios,
    aportesFONASA,
    aporteFRL,
    aportesFondoSolidaridad,
    adicionalFondoSolidaridad,
    aportesCJPPU,
    otrasDeducciones
  )
  const salarioLiquido =
    salarioNominal - aportesJubilatorios - aportesFONASA - aporteFRL - totalIRPF

  // Redondear todos los valores a dos numeros decimales, dejandolos como numeros.
  const salarioLiquidoRedondeado = salarioLiquido // Number(salarioLiquido.toFixed(2))
  const aportesJubilatoriosRedondeado = aportesJubilatorios // Number(aportesJubilatorios.toFixed(2))
  const aportesFONASARedondeado = aportesFONASA // Number(aportesFONASA.toFixed(2))
  const aporteFRLRedondeado = aporteFRL // Number(aporteFRL.toFixed(2))

  const detalleIRPFRedondeado = {
    impuestoFranja: detalleIRPF.impuestoFranja, // detalleIRPF.impuestoFranja.map((n) => Number(n.toFixed(2))),
    deducciones: detalleIRPF.deducciones, // Number(detalleIRPF.deducciones.toFixed(2)),
    tasaDeducciones: detalleIRPF.tasaDeducciones,
  }
  const totalIRPFRedondeado = totalIRPF // Number(totalIRPF.toFixed(2))

  return {
    salarioLiquido: salarioLiquidoRedondeado,
    aportesJubilatorios: aportesJubilatoriosRedondeado,
    aportesFONASA: aportesFONASARedondeado,
    aporteFRL: aporteFRLRedondeado,
    detalleIRPF: detalleIRPFRedondeado,
    totalIRPF: totalIRPFRedondeado,
  }
}
