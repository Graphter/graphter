export interface Branch {
  condition: string | ((data: any) => boolean)
  childId: string
}
