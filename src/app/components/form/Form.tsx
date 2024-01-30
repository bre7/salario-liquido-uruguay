"use client"

import { BPC } from "#/app/data/constants"
// import { numeral } from "#/app/numeral"
import "./Form.scss"

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
  onFormSubmitted: (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void
  formState: IFormState
}) {

  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])

  /**
   * Función que se invoca al seleccionar un input.
   * Selecciona los contenidos del mismo.
   */
  function handleFocus(e: React.FocusEvent) {
    e.target?.select()
  }

  const submitBtnClasses = ["btnSubmit"]
  if (!formState.formValido) {
    submitBtnClasses.push("btnSubmit-invalido")
  }

  return (
    <form className="form" onSubmit={onFormSubmitted}>
      <div className="form-grid">
        <label htmlFor="anio">Año</label>
        <input
          id="anio"
          name="anio"
          className="form-input"
          type="number"
          onChange={onFormElementChanged}
          defaultValue={formState.anio}
        />

        <label htmlFor="inputSalario">Salario nominal en pesos:</label>
        <input
          id="inputSalario"
          name="salarioNominal"
          className="form-input"
          type="number"
          min="0"
          onFocus={handleFocus}
          // value={numeral(formState.salarioNominal).format(NUMERAL_FORMAT_STRING)}
          value={formState.salarioNominal}
          onChange={onFormElementChanged}
        />
      </div>

      { BPC.has(formState.anio) ? null : <div style={{ margin: "2rem auto", textAlign: "center", backgroundColor: "#f8d7da", maxWidth: "50%", padding: "1rem"}}>BPC no encontrado para el año {formState.anio}</div>}


      <h2 className="form-section">Cálculo de aportes BPS</h2>
      <div className="form-grid">
        <label htmlFor="inputHijosACargo">¿Tiene hijos a cargo?</label>
        <input
          id="inputHijosACargo"
          name="tieneHijos"
          className="form-input"
          type="checkbox"
          checked={formState.tieneHijos}
          onChange={onFormElementChanged}
        />
        <label htmlFor="inputConyujeACargo">¿Tiene cónyuge a cargo?</label>
        <input
          id="inputConyujeACargo"
          name="tieneConyuge"
          className="form-input"
          type="checkbox"
          checked={formState.tieneConyuge}
          onChange={onFormElementChanged}
        />
      </div>
      <h2 className="form-section">Cálculo de IRPF</h2>
      <h3 className="form-subSection">Cantidad de personas a cargo:</h3>
      <div className="form-grid">
        <label htmlFor="inputFactorDeduccion">
          Porcentaje de deducción de las personas a cargo:
        </label>
        <select
          id="inputFactorDeduccion"
          name="factorDeduccionPersonasACargo"
          className="form-input"
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
          className="form-input"
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
          className="form-input"
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.cantHijosConDiscapacidad}
          onChange={onFormElementChanged}
        />
      </div>
      <h3 className="form-subSection">Si es profesional:</h3>
      <div className="form-grid">
        <label htmlFor="inputAportesFondoSolidaridad">¿Aporta al Fondo de Solidaridad?</label>
        <select
          id="inputAportesFondoSolidaridad"
          name="aportesFondoSolidaridad"
          className="form-input"
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
          className="form-input"
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
          className="form-input"
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
          className="form-input"
          type="number"
          onFocus={handleFocus}
          min="0"
          value={formState.otrasDeducciones}
          onChange={onFormElementChanged}
        />
      </div>
      { BPC.has(formState.anio) ?
        <button key={+new Date()} className={submitBtnClasses.join(" ")}>
          Calcular
        </button>
       : null }
    </form>
  )
}

export default Form
