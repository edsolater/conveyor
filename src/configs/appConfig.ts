export type AppConfig = {
  appName: string
  navigator: {
    navButtons: {
      name: string
      path: string
      isHome?: boolean
    }[]
  }
}

export const appConfig: AppConfig = {
  appName: 'Conveyor',
  navigator: {
    navButtons: [
      {
        name: 'Home',
        path: '/',
        isHome: true,
      },
      {
        name: 'Playground',
        path: '/playground',
      },
    ],
  },
}
