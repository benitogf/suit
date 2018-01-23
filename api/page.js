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
          insert:'  Any kind should work\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'water',
      data:[{
        ops:[{
          insert:'  It needs to boil\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'vegetables',
      data:[{
        ops:[{
          insert:'  Preferably fresh\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'meat',
      data:[{
        ops:[{
          insert:'  Raw with some salt for the flavor\n'
        }]
      }]
    },
    {
      parent:'root',
      id:'fire',
      data:[{
        ops:[{
          insert:'  Don\'t put this inside it, just around for a while\n'
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
