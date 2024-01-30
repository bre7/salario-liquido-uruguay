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
import classNames from "classnames"
import styles from "./Result.module.scss"

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
    <div className={styles.result}>
      <div className={styles.liquido}>
        <span className={styles.liquidoLabel}> Salario líquido:</span>{" "}
        <span className={styles.liquidoDato}>
          {numeral(salarioLiquido).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
        {totalFondoSolidaridadRedondeado() || aportesCJPPURedondeado() ? (
          <span className={styles.liquidoInfo}>
            <span className={styles.liquidoInfoItem}>?</span>
            <span className={styles.liquidoTooltip}>
              El salario líquido es el nominal menos los descuentos de BPS e IRPF, antes de los
              descuentos profesionales.
            </span>
          </span>
        ) : null}
      </div>
      <h2 className={styles.resultSection}>Detalle BPS:</h2>
      <div className={styles.detalleBPS}>
        <span className={styles.tablaBPSLabel}>Jubilatorio</span>
        <span className={styles.tablaBPSDato}>
          {numeral(aportesJubilatorios).format(NUMERAL_FORMAT_STRING)}
        </span>
        <span className={styles.tablaBPSLabel}>FONASA</span>
        <span className={styles.tablaBPSDato}>
          {numeral(aportesFONASA).format(NUMERAL_FORMAT_STRING)}
        </span>
        <span className={styles.tablaBPSLabel}>FRL</span>
        <span className={styles.tablaBPSDato}>
          {numeral(aporteFRL).format(NUMERAL_FORMAT_STRING)}
        </span>
        <span className={styles.tablaBPSLabel}>Total BPS:</span>
        <span className={classNames(styles.tablaBPSDato, styles.totalBPS)}>
          {numeral(totalBPSRedondeado()).format(NUMERAL_FORMAT_STRING)}
        </span>
      </div>
      <h2 className={styles.resultSection}>Detalle IRPF:</h2>
      <div className={styles.detalleIRPF}>
        <span className={styles.tablaIRPFHead}>Desde</span>
        <span className={styles.tablaIRPFHead}>Hasta</span>
        <span className={styles.tablaIRPFHead}>Tasa</span>
        <span className={styles.tablaIRPFHead}>Impuesto:</span>
        {IRPF_FRANJAS.map((franja, index) => {
          return (
            <React.Fragment key={`irpf${index}`}>
              <span className={styles.tablaIRPFDato}>{franja.desde} BPC</span>
              <span className={styles.tablaIRPFDato}>
                {franja.hasta !== 0 ? franja.hasta + " BPC" : "-"}
              </span>
              <span className={styles.tablaIRPFDato}>{franja.tasa}%</span>
              <span className={styles.tablaIRPFDato}>
                {numeral(detalleIRPF?.impuestoFranja[index] ?? 0).format(NUMERAL_FORMAT_STRING)}
              </span>
            </React.Fragment>
          )
        })}
      </div>
      <div className={styles.resumenIRPF}>
        <span className={styles.resumenIRPFLabel}>Deducciones:</span>
        <span className={classNames(styles.resumenIRPFDato, styles.resumenIRPFDeducciones)}>
          {detalleIRPF?.deducciones
            ? numeral(detalleIRPF.deducciones).format(NUMERAL_CURRENCY_FORMAT_STRING)
            : 0}
        </span>
        <span className={styles.resumenIRPFLabel}>Tasa deducciones:</span>
        <span className={classNames(styles.resumenIRPFDato, styles.resumenIRPFTasa)}>
          {detalleIRPF?.tasaDeducciones ?? 0}%
        </span>
        <span className={styles.resumenIRPFLabelTotal}>Total IRPF:</span>
        <span className={classNames(styles.resumenIRPFDato, styles.resumenIRPFTotal)}>
          {numeral(totalIRPF).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
      </div>
      <h2 className={styles.resultSection}>Profesionales:</h2>
      <div className={styles.detalleProfesionales}>
        <span className={styles.tablaProfesionalesLabel}>Fondo Solidaridad:</span>
        <span className={styles.tablaProfesionalesDato}>
          {numeral(totalFondoSolidaridadRedondeado()).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
        <span className={styles.tablaProfesionalesLabel}>Aportes CJPPU / Caja Notarial:</span>
        <span className={styles.tablaProfesionalesDato}>
          {numeral(aportesCJPPURedondeado()).format(NUMERAL_CURRENCY_FORMAT_STRING)}
        </span>
      </div>
    </div>
  )
}

export default Result
