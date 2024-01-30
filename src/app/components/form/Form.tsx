"use client"

import { BPC, TOPE_APORTES_JUBILATORIOS } from "#/app/data/constants"
// import { numeral } from "#/app/numeral"
import classNames from "classnames"
import styles from "./Form.module.scss"

export interface IFormState {
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
  formValido: boolean
}

function Form({
  onFormElementChanged,
  onFormSubmitted,
  formState,
}: {
  onFormElementChanged: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onFormSubmitted: (
    event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => void
  formState: IFormState
}) {
  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])

  /**
   * Función que se invoca al seleccionar un input.
   * Selecciona los contenidos del mismo.
   */
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target?.select()
  }

  return (
    <form className={styles.form} onSubmit={onFormSubmitted}>
      <div className={styles.formGrid}>
        <label htmlFor="anio">Año</label>
        <input
          id="anio"
          name="anio"
          className={styles.formInput}
          type="number"
          onChange={onFormElementChanged}
          defaultValue={formState.anio}
        />

        <label htmlFor="inputSalario">Salario nominal en pesos:</label>
        <input
          id="inputSalario"
          name="salarioNominal"
          className={styles.formInput}
          type="number"
          min="0"
          onFocus={handleFocus}
          // value={numeral(formState.salarioNominal).format(NUMERAL_FORMAT_STRING)}
          value={formState.salarioNominal}
          onChange={onFormElementChanged}
        />
      </div>

      {BPC.has(formState.anio) ? null : (
        <div
          style={{
            margin: "2rem auto",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            maxWidth: "50%",
            padding: "1rem",
          }}
        >
          BPC no encontrado para el año {formState.anio}
        </div>
      )}

      {TOPE_APORTES_JUBILATORIOS.has(formState.anio) ? null : (
        <div
          style={{
            margin: "2rem auto",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            maxWidth: "50%",
            padding: "1rem",
          }}
        >
          TOPE APORTE JUBILATORIO no encontrado para el año {formState.anio}, utilizando valor de{" "}
          {formState.anio - 1}
        </div>
      )}

      <h2 className={styles.formSection}>Cálculo de aportes BPS</h2>
      <div className={styles.formGrid}>
        <label htmlFor="inputHijosACargo">¿Tiene hijos a cargo?</label>
        <input
          id="inputHijosACargo"
          name="tieneHijos"
          className={styles.formInput}
          type="checkbox"
          checked={formState.tieneHijos}
          onChange={onFormElementChanged}
        />
        <label htmlFor="inputConyujeACargo">¿Tiene cónyuge a cargo?</label>
        <input
          id="inputConyujeACargo"
          name="tieneConyuge"
          className={styles.formInput}
          type="checkbox"
          checked={formState.tieneConyuge}
          onChange={onFormElementChanged}
        />
      </div>
      <h2 className={styles.formSection}>Cálculo de IRPF</h2>
      <h3 className={styles.formSubSection}>Cantidad de personas a cargo:</h3>
      <div className={styles.formGrid}>
        <label htmlFor="inputFactorDeduccion">
          Porcentaje de deducción de las personas a cargo:
        </label>
        <select
          id="inputFactorDeduccion"
          name="factorDeduccionPersonasACargo"
          className={styles.formInput}
          value={formState.factorDeduccionPersonasACargo}
          onChange={onFormElementChanged}
        >
          <option value="1">100%</option>
          <option value="0.5">50%</option>
          <option value="0">No deducción</option>
        </select>
        <label htmlFor="inputHijosSinDiscapacidad">Cantidad de hijos sin discapacidad:</label>
        <input
          id="inputHijosSinDiscapacidad"
          name="cantHijosSinDiscapacidad"
          className={styles.formInput}
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.cantHijosSinDiscapacidad}
          onChange={onFormElementChanged}
        />
        <label htmlFor="inputHijosConDiscapacidad">Cantidad de hijos con discapacidad:</label>
        <input
          id="inputHijosConDiscapacidad"
          name="cantHijosConDiscapacidad"
          className={styles.formInput}
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.cantHijosConDiscapacidad}
          onChange={onFormElementChanged}
        />
      </div>
      <h3 className={styles.formSubSection}>Si es profesional:</h3>
      <div className={styles.formGrid}>
        <label htmlFor="inputAportesFondoSolidaridad">¿Aporta al Fondo de Solidaridad?</label>
        <select
          id="inputAportesFondoSolidaridad"
          name="aportesFondoSolidaridad"
          className={styles.formInput}
          value={formState.aportesFondoSolidaridad}
          onChange={onFormElementChanged}
        >
          <option value="0">No</option>
          <option value="0.5">1/2 BPC</option>
          <option value="1">1 BPC</option>
          <option value="2">2 BPC</option>
        </select>
        <label htmlFor="inputAdicionalFondoSolidaridad">¿Adicional Fondo de Solidaridad?</label>
        <input
          id="inputAdicionalFondoSolidaridad"
          name="adicionalFondoSolidaridad"
          className={styles.formInput}
          type="checkbox"
          checked={formState.adicionalFondoSolidaridad}
          onChange={onFormElementChanged}
        />
        <label htmlFor="inputAportesCajaProfesionales">
          Aporte mensual a CJPPU o Caja Notarial:
        </label>
        <input
          id="inputAportesCajaProfesionales"
          name="aportesCJPPU"
          className={styles.formInput}
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.aportesCJPPU}
          onChange={onFormElementChanged}
        />
        <label htmlFor="inputOtrasDeducciones">Otras deducciones:</label>
        <input
          id="inputOtrasDeducciones"
          name="otrasDeducciones"
          className={styles.formInput}
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.otrasDeducciones}
          onChange={onFormElementChanged}
        />
      </div>
      {BPC.has(formState.anio) ? (
        <button
          key={+new Date()}
          className={classNames(styles.btnSubmit, {
            [`${styles.btnSubmitInvalido}`]: !formState.formValido,
          })}
        >
          Calcular
        </button>
      ) : null}
    </form>
  )
}

export default Form
