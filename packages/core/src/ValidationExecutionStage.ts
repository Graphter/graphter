export enum ValidationExecutionStage {
  CHANGE = 'CHANGE',
  CLIENT_UPDATE = 'CLIENT_UPDATE',
  CLIENT_CREATE = 'CLIENT_CREATE',
  SERVER_UPDATE = 'SERVER_UPDATE',
  SERVER_CREATE = 'SERVER_CREATE'
}

export const AllValidationExecutionStages = Object.values(ValidationExecutionStage)