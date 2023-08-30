export const appConfig = {
  appName: 'conveyor',
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
  },
}

export type GlobalConfig = typeof appConfig
