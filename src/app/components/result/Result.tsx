"use client"

import React from "react"

// import history from "#/app/history"
import { numeral } from "#/app/numeral"
import { DetalleIRPF } from "#/app/services/calculos"
import {
  ADICIONAL_FONDO_SOLIDARIDAD,
  BPC,
  IRPF_FRANJAS,
  NUMERAL_CURRENCY_FORMAT_STRING,
  NUMERAL_FORMAT_STRING,
} from "#data/constants"
import "./Result.scss"

interface IProps {
  anio: number
  formSubmitted: boolean
  salarioLiquido: number
  aportesJubilatorios: number
  aportesFONASA: number
  aporteFRL: number
  detalleIRPF: DetalleIRPF | null
  totalIRPF: number
  aportesFondoSolidaridad: number
  adicionalFondoSolidaridad: boolean
  aportesCJPPU: number
}

function Result({ calculateFrom }: { calculateFrom: IProps }) {
  const {
    anio,
    formSubmitted,
    salarioLiquido,
    aportesJubilatorios,
    aportesFONASA,
    aporteFRL,
    detalleIRPF,
    totalIRPF,
    aportesFondoSolidaridad,
    adicionalFondoSolidaridad,
    aportesCJPPU,
  } = calculateFrom

  // useEffect(() => {
  //   console.log("Result: useEffect", calculateFrom)
  //   window.scrollTo(0, 0)
  // }, [])

  // Para evitar que el usuario navegue directamente a esta pagina sin pasar por el formulario
  // if (!formSubmitted) {
  //   history.push("/")
  //   return <span>Redirigiendo...</span>
  // }

  const totalFondoSolidaridadRedondeado = () =>
    Number(
      (aportesFondoSolidaridad * BPC.get(anio)!) / 12 + // TODO: Check not null
        (adicionalFondoSolidaridad ? ADICIONAL_FONDO_SOLIDARIDAD(anio)! : 0) // TODO: Check not null
    ) // .toFixed(2)

  const aportesCJPPURedondeado = () => aportesCJPPU // Number(aportesCJPPU.toFixed(2))

  const totalBPSRedondeado = () => aportesJubilatorios + aportesFONASA + aporteFRL //.toFixed(2)

  return (
    <div className="result">
      {/* <Link className="btnVolver" href="/">
        Volver
      </Link> */}
      <div className="liquido">
        <span className="liquido-label"> Salario líquido:</span>{" "}
        <span className="liquido-dato">
          {numeral(salarioLiquido).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
        {totalFondoSolidaridadRedondeado() || aportesCJPPURedondeado() ? (
          <span className="liquido-info">
            <span className="liquido-info-i">?</span>
            <span className="liquido-tooltip">
              El salario líquido es el nominal menos los descuentos de BPS e IRPF, antes de los
              descuentos profesionales.
            </span>
          </span>
        ) : null}
      </div>
      <h2 className="result-section">Detalle BPS:</h2>
      <div className="detalleBPS">
        <span className="tablaBPS-label">Jubilatorio</span>
        <span className="tablaBPS-dato">
          {numeral(aportesJubilatorios).format(NUMERAL_FORMAT_STRING)}
        </span>
        <span className="tablaBPS-label">FONASA</span>
        <span className="tablaBPS-dato">
          {numeral(aportesFONASA).format(NUMERAL_FORMAT_STRING)}
        </span>
        <span className="tablaBPS-label">FRL</span>
        <span className="tablaBPS-dato">{numeral(aporteFRL).format(NUMERAL_FORMAT_STRING)}</span>
        <span className="tablaBPS-label">Total BPS:</span>
        <span className="tablaBPS-dato totalBPS">
          {numeral(totalBPSRedondeado()).format(NUMERAL_FORMAT_STRING)}
        </span>
      </div>
      <h2 className="result-section">Detalle IRPF:</h2>
      <div className="detalleIRPF">
        <span className="tablaIRPF-head">Desde</span>
        <span className="tablaIRPF-head">Hasta</span>
        <span className="tablaIRPF-head">Tasa</span>
        <span className="tablaIRPF-head">Impuesto:</span>
        {IRPF_FRANJAS.map((franja, index) => {
          return (
            <React.Fragment key={`irpf-${index}`}>
              <span className="tablaIRPF-dato">{franja.desde} BPC</span>
              <span className="tablaIRPF-dato">
                {franja.hasta !== 0 ? franja.hasta + " BPC" : "-"}
              </span>
              <span className="tablaIRPF-dato">{franja.tasa}%</span>
              <span className="tablaIRPF-dato">
                {numeral(detalleIRPF?.impuestoFranja[index] ?? 0).format(NUMERAL_FORMAT_STRING)}
              </span>
            </React.Fragment>
          )
        })}
      </div>
      <div className="resumenIRPF">
        <span className="resumenIRPF-label">Deducciones:</span>
        <span className="resumenIRPF-dato resumenIRPF-deducciones">
          {detalleIRPF?.deducciones
            ? numeral(detalleIRPF.deducciones).format(NUMERAL_CURRENCY_FORMAT_STRING)
            : 0}
        </span>
        <span className="resumenIRPF-label">Tasa deducciones:</span>
        <span className="resumenIRPF-dato resumenIRPF-tasa">
          {detalleIRPF?.tasaDeducciones ?? 0}%
        </span>
        <span className="resumenIRPF-labelTotal">Total IRPF:</span>
        <span className="resumenIRPF-dato resumenIRPF-total">
          {numeral(totalIRPF).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
      </div>
      <h2 className="result-section">Profesionales:</h2>
      <div className="detalleProfesionales">
        <span className="tablaProfesionales-label">Fondo Solidaridad:</span>
        <span className="tablaProfesionales-dato">
          {numeral(totalFondoSolidaridadRedondeado()).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
        <span className="tablaProfesionales-label">Aportes CJPPU / Caja Notarial:</span>
        <span className="tablaProfesionales-dato">
          {numeral(aportesCJPPURedondeado()).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
      </div>
    </div>
  )
}

export default Result
