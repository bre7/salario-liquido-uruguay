import { BPC } from "#data/constants"
import { calcularAportesBPS, calcularIPRF, calcularImpuestos } from "./calculos"

declare global {
  interface Array<T> {
    random(): T
    first(): T
  }
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.first = function () {
  return this[0]
}

const anyValidAnio = () => Array.from(BPC.keys()).random()
const lastValidAnio = () =>
  Array.from(BPC.keys())
    .sort((a, b) => b - a)
    .first()
const invalidAnio = () => lastValidAnio() + 1

describe("Probar cálculo de aportes BPS para 2022", () => {
  test.each([
    [1_000, false, false, 150, 30, 1],
    [1_000, true, false, 150, 30, 1],
    [1_000, false, true, 150, 50, 1],
    [1_000, true, true, 150, 50, 1],
    [20_000, false, false, 3_000, 9_00, 20],
    [20_000, true, false, 3_000, 1_200, 20],
    [20_000, false, true, 3_000, 1_300, 20],
    [20_000, true, true, 3_000, 1_600, 20],
  ])(
    "Calcula aportes BPS correctamente",
    (
      salarioNominal,
      tieneHijos,
      tieneConyuge,
      esperadoJubilatorio,
      esperadoFONASA,
      esperadoFRL
    ) => {
      const resultado = calcularAportesBPS(2022, salarioNominal, tieneHijos, tieneConyuge)

      // Lo esperado deberia estar a un valor razonable de lo obtenido, para evitar errores de redondeo
      expect(resultado.aportesJubilatorios).toBeCloseTo(esperadoJubilatorio)
      expect(resultado.aportesFONASA).toBeCloseTo(esperadoFONASA)
      expect(resultado.aporteFRL).toBeCloseTo(esperadoFRL)
    }
  )

  test.each([
    [202_693, 30_404],
    [250_000, 32_276.9],
  ])("Aplican topes jubilatorios", (salarioNominal, esperadoJubilatorio) => {
    /**
     * El aporte jubilatorio se aplica hasta el tope 188411 (valor 2020).
     */
    const resultado = calcularAportesBPS(2022, salarioNominal, false, false)

    // Lo esperado deberia estar a un valor razonable de lo obtenido, para evitar errores de redondeo
    expect(resultado.aportesJubilatorios).toBeCloseTo(esperadoJubilatorio, 1)
  })
})

describe("Probar cálculo de IRPF para 2022", () => {
  test.each([
    [
      20_000,
      1,
      0,
      0,
      3_000,
      900,
      20,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 0, 0, 0, 0, 0, 0, 0], deducciones: 3_920 },
      0,
    ],
    [
      40_000,
      1,
      0,
      0,
      6_000,
      1_800,
      40,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 385, 0, 0, 0, 0, 0, 0], deducciones: 7_840 },
      0,
    ],
    [
      80_000,
      1,
      0,
      0,
      12_000,
      3_600,
      80,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 1_549.2, 3_873, 1_761.6, 0, 0, 0, 0], deducciones: 15_680 },
      5_929.4,
    ],
    [
      80_000,
      1,
      1,
      0,
      12_000,
      3_600,
      80,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 1_549.2, 3873, 1_761.6, 0, 0, 0, 0], deducciones: 21_274.33 },
      5_481.85,
    ],
    [
      80_000,
      1,
      0,
      1,
      12_000,
      3_600,
      80,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 1_549.2, 3_873, 1_761.6, 0, 0, 0, 0], deducciones: 26_868.67 },
      5_034.31,
    ],
    [
      80_000,
      1,
      1,
      1,
      12_000,
      3_600,
      80,
      0,
      0,
      false,
      0,
      { impuestoFranja: [0, 1_549.2, 3_873, 1_761.6, 0, 0, 0, 0], deducciones: 32_463 },
      4_586.76,
    ],
  ])(
    "Calcula IRPF correctamente para 2022",
    (
      salarioNominal,
      factorDeduccionPersonasACargo,
      cantHijosSinDiscapacidad,
      cantHijosConDiscapacidad,
      aportesJubilatorios,
      aportesFONASA,
      aporteFRL,
      aportesCJPPU,
      aportesFondoSolidaridad,
      adicionalFondoSolidaridad,
      otrasDeducciones,
      esperadoDetalleIRPF,
      esperadoTotalIRPF
    ) => {
      const resultado = calcularIPRF(
        2022,
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

      // Lo esperado deberia estar a un valor razonable de lo obtenido, para evitar errores de redondeo

      expect(resultado.detalleIRPF.impuestoFranja[0]).toBeCloseTo(
        esperadoDetalleIRPF.impuestoFranja[0]
      )
      expect(resultado.detalleIRPF.impuestoFranja[1]).toBeCloseTo(
        esperadoDetalleIRPF.impuestoFranja[1],
        -0.5
      )
      expect(resultado.detalleIRPF.impuestoFranja[2]).toBeCloseTo(
        esperadoDetalleIRPF.impuestoFranja[2],
        -0.5
      )
      expect(resultado.detalleIRPF.impuestoFranja[3]).toBeCloseTo(
        esperadoDetalleIRPF.impuestoFranja[3],
        -0.5
      )
      expect(resultado.detalleIRPF.impuestoFranja[4]).toBeCloseTo(
        esperadoDetalleIRPF.impuestoFranja[4],
        -0.5
      )
      expect(resultado.detalleIRPF.deducciones).toBeCloseTo(esperadoDetalleIRPF.deducciones, -0.5)
      expect(resultado.totalIRPF).toBeCloseTo(esperadoTotalIRPF, -0.5)
    }
  )
})

describe("Probar cálculo total", () => {
  test.each([[100, false, false, 1, 0, 0, 0, false, 0, 0, 82]])(
    "Calcula impuestos correctamente",
    (
      salarioNominal,
      tieneHijos,
      tieneConyuge,
      factorDeduccionPersonasACargo,
      cantHijosSinDiscapacidad,
      cantHijosConDiscapacidad,
      aportesFondoSolidaridad,
      adicionalFondoSolidaridad,
      aportesCJPPU,
      otrasDeducciones,
      esperadoSalarioLiquido
    ) => {
      const {
        salarioLiquido,
        aportesJubilatorios,
        aportesFONASA,
        aporteFRL,
        detalleIRPF,
        totalIRPF,
      } = calcularImpuestos(
        2022,
        salarioNominal,
        tieneHijos,
        tieneConyuge,
        factorDeduccionPersonasACargo,
        cantHijosSinDiscapacidad,
        cantHijosConDiscapacidad,
        aportesFondoSolidaridad,
        adicionalFondoSolidaridad,
        aportesCJPPU,
        otrasDeducciones
      )

      expect(salarioLiquido).toBeCloseTo(esperadoSalarioLiquido, -0.5)
    }
  )
})
