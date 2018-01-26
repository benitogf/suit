/**
 * Mocking client-server processing
 */
const pictures = {
  apple: '',
  orange: '',
  tomato: '',
  blueberry: '',
  durian: '',
  dragon: '',
  kiwi: ''
}

const _products = [
  {
    "id": 0,
    "picture": '',
    "name": "Apple",
    "price": 40.54,
    "basePrice": 40.54,
    "inventory": -1,
    "quantity": 1,
    "description": "just one apple.",
    "variant": "green",
    "bulk": "single",
    "variants": [
      {
        "label": "green",
        "price": 40.54
      },
      {
        "label": "red",
        "price": 50.45
      }
    ],
    "bulks": [
      {
        "label": "single",
        "quantity": 1,
        "factor": 1
      },
      {
        "label": "docen",
        "quantity": 12,
        "factor": 11.2
      }
    ]
  },
  {
    "id": 1,
    "picture": '',
    "name": "Orange Dozen",
    "price": 120.99,
    "basePrice": 120.99,
    "inventory": 5,
    "quantity": 1,
    "description": "Just one dozen of oranges.",
    "bulk": "dozen",
    "bulks": [
      {
        "label": "dozen",
        "quantity": 12,
        "factor": 11.2
      }
    ]
  },
  {
    "id": 2,
    "picture": '',
    "name": "Tomato",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 5,
    "quantity": 1,
    "description": "Just one tomato."
  },
  {
    "id": 3,
    "picture": '',
    "name": "Blueberry",
    "price": 39.99,
    "basePrice": 39.99,
    "inventory": 1,
    "quantity": 1,
    "description": "Some blueberries."
  },
  {
    "id": 4,
    "picture": '',
    "name": "Durian",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just one durian."
  },
  {
    "id": 5,
    "picture": '',
    "name": "Dragon Fruit",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just one dragon fruit."
  },
  {
    "id": 6,
    "picture": '',
    "name": "Kiwi",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just one kiwi."
  },
  {
    "id": 7,
    "picture": '',
    "name": "Strawberry",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just a few strawberries."
  },
  {
    "id": 8,
    "picture": '',
    "name": "Grapes",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just a few grapes."
  },
  {
    "id": 9,
    "picture": '',
    "name": "Mango",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just a few mangoes."
  },
  {
    "id": 10,
    "picture": '',
    "name": "Watermelon",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just a big watermelon."
  },
  {
    "id": 11,
    "picture": '',
    "name": "Passionfruit",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just a Passionfruit."
  }
]

export default {
  getProducts (cb) {
    setTimeout(() => cb(_products), 100)
  },

  buyProducts (products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
        ? cb()
        : errorCb()
    }, 100)
  }
}
