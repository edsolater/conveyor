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
        isHome: true,
        name: 'Home',
        path: '/',
      },
      {
        name: 'Playground',
        path: '/playground',
      },
      { name: 'Links', path: '/thumbnails' },
    ],
  },
}
