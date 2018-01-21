/**
 * Mocking client-server processing
 */
const __soup = {
  root:[
    {
      parent:'root',
      id:'noodles',
      data:[{
        ops:[{
          insert:'any kind should work\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'water',
      data:[{
        ops:[{
          insert:'it needs to boil\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'vegetables',
      data:[{
        ops:[{
          insert:'preferably fresh\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'meat',
      data:[{
        ops:[{
          insert:'raw with some salt for the flavor\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'fire',
      data:[{
        ops:[{
          insert:'don\'t put this inside it, just around for a while\n'
        }]
      }]
    }
  ],
  noodles:[],
  water:[],
  vegetables:[],
  meat:[],
  fire:[]
}

export default {
  getPage (name, cb) {
    if (name === 'soup') {
      setTimeout(() => cb(__soup), 100)
    } else {
      setTimeout(() => cb({ root:[] }), 100)
    }
  }
}
