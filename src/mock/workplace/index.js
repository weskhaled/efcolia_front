import Mock from 'mockjs'
// import {activities, templates} from '../common/activityData'
// import {teams} from '../../mock/common'
import {companies, devices} from '../../mock/common'

// activities.forEach(item => {
//   item.template = templates[item.activity.type](item.user, item.activity)
// })

Mock.mock('/work/companies', 'get', () => {
  return companies
})

Mock.mock('/work/devices', 'get', () => {
  return devices
})
