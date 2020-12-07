import { ValidationErrorDisplayMode } from "./ValidationErrorDisplalyMode";

export interface ValidationResult {
  valid: boolean
  errorMessage?: string
  errorDisplayMode?: Array<ValidationErrorDisplayMode>
}
