import { Commit } from 'vuex'

const setContentType = async ({
  module,
  type,
  commit
}: {
  module: string
  type: string
  commit: Commit
}) => {
  const context = await require.context(
    `@/assets/content/${type}`,
    false,
    /\.json$/
  )
  const items = context.keys().map(context)
  const name = type[0].toUpperCase().concat(type.slice(1))
  await commit(`${module}/set${name}`, items)
}

export const actions = {
  async nuxtServerInit({ commit }: { commit: Commit }) {
    const setupPromises = [] as Promise<any>[]
    const types = {
      blog: ['posts', 'categories', 'authors']
    }
    Object.entries(types).forEach(([module, types]) => {
      for (const type of types) {
        setupPromises.push(setContentType({ module, type, commit }))
      }
    })
    await Promise.all(setupPromises)
  }
}
