import Mock from 'mockjs'

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/routes`, 'get', () => {
  let result = {}
  result.code = 0
  result.data = [{
    router: 'root',
    children: [
      {
        router: 'cartographie',
        name: 'cartographie',
        icon: 'dashboard',
        // authority: 'form'
      }
    ]
  }]
  return result
})
