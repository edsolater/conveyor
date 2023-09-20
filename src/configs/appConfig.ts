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

const appName = 'Conveyor'
const routes = {
  Home: '/',
  Playground: '/playground',
  LinkPage: '/linkPage',
}

export const appConfig: AppConfig = {
  appName: appName,
  navigator: { navButtons: Object.entries(routes).map(([name, path]) => ({ isHome: name === 'Home', name, path })) },
}
