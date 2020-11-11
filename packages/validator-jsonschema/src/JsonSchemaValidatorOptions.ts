import { ValidationErrorDisplayMode, ValidationExecutionStage } from "@graphter/core";

export interface JsonSchemaValidatorOptions {
  schema: object,
  error?: string | ((data: any) => string)
  errorDisplayMode?: ValidationErrorDisplayMode | Array<ValidationErrorDisplayMode>
}