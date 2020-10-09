const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
]

const positions = [
  {
    CN: '前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台',
    FR: 'Front-end engineer | VUE platform',
    US: 'Front-end engineer | VUE platform',
  },
]

const sayings = [
  'At that time I only thought about what I wanted, never wanted to have what I had',
]

const logos = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
]

const admins = ['Weskhaled']

const groups = ['Highly compelling design team']

const users = [
  {
    name: 'weskhaled',
    avatar: avatars[0],
    groupId: 0,
  },
]

const teams = groups.map((item, index) => {
  return {
    name: item,
    avatar: avatars[index],
  }
})

const companies = [
  {
    id: 1,
    name: 'test1',
    location: 'testlocaltion'
  },
  {
    id: 2,
    name: 'test2',
    location: 'testlocaltion'
  },
  {
    id: 3,
    name: 'test3',
    location: 'testlocaltion'
  },
]

const devices = [
  {
    id: '1',
    name: 'test1',
    date: '1/11/2010 15:11:11',
    infos: {
      address: {
        startAddress: 'Rue Voltaire',
        endAddress: '1000 TROYES FRANCE',
        startGeo: '124.234N',
        endGeo: '124.234E',
      },
      desc: {
        text: 'desc',
        id: 123124324,
      },
    },
  },
  {
    id: '2',
    name: 'test1',
    date: '1/11/2010 15:11:11',
    infos: {
      address: {
        startAddress: 'Rue Voltaire',
        endAddress: '1000 TROYES FRANCE',
        startGeo: '124.234N',
        endGeo: '124.234E',
      },
      desc: {
        text: 'desc',
        id: 123124324,
      },
    },
  },
  {
    id: '3',
    name: 'test1',
    date: '1/11/2010 15:11:11',
    infos: {
      address: {
        startAddress: 'Rue Voltaire',
        endAddress: '1000 TROYES FRANCE',
        startGeo: '124.234N',
        endGeo: '124.234E',
      },
      desc: {
        text: 'desc',
        id: 123124324,
      },
    },
  },
]


export {
  logos,
  sayings,
  positions,
  avatars,
  admins,
  groups,
  users,
  teams,
  companies,
  devices,
}
