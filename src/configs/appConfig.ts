export type GlobalConfig = {
  navigator: {
    navButtons?: {
      name: string
      path: string
    }[]
    documentTitle?: string
  }
}
export const appConfig: GlobalConfig = {
  navigator: {
    navButtons: [
      {
        name: 'Home',
        path: '/',
      },
      {
        name: 'Playground',
        path: '/playground',
      },
    ],
    documentTitle: 'conveyor',
  },
}
