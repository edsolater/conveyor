export type GlobalConfig = {
  appName: string
  navigator: {
    navButtons: {
      name: string
      path: string
      isHome?: boolean
    }[]
  }
}

export const appConfig = {
  appName: 'Conveyor',
  navigator: {
    navButtons: [
      {
        isHome: true,
        name: 'Home',
        path: '/',
      },
      {
        name: 'Playground',
        path: '/playground',
      },
    ],
  },
} satisfies GlobalConfig
