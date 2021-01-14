import Mock from 'mockjs'
import { logos, sayings, positions, avatars, admins } from '../common'

const Random = Mock.Random

const timeList = [
  {
    CN: '早上好',
    FR: 'Bonjour',
    US: 'Good morning',
  },
  {
    CN: '中午好',
    FR: 'Bonne après-midi',
    US: 'Good afternoon',
  },
  {
    CN: '下午好',
    FR: 'Bonne après-midi',
    US: 'Good afternoon',
  },
  {
    CN: '晚上好',
    FR: 'Bonsoir',
    US: 'Good evening',
  },
]

const welcomeMessages = [
  {
    CN: '要不要打一把 DOTA',
    FR: 'que diriez-vous d\'un jeu de DOTA',
    US: 'how about a game of DOTA',
  },
]

Random.extend({
  admin() {
    return this.pick(admins)
  },
  welcome() {
    return this.pick(welcomeMessages)
  },
  timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9
      ? timeList[0]
      : hour <= 11
      ? timeList[1]
      : hour <= 13
      ? timeList[2]
      : hour <= 20
      ? timeList[3]
      : timeList[4]
  },
  avatar() {
    return this.pick(avatars)
  },
  position() {
    return this.pick(positions)
  },
  saying() {
    return this.pick(sayings)
  },
  logo() {
    return this.pick(logos)
  },
})
