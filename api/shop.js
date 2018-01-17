/**
 * Mocking client-server processing
 */
import pictures from './pictures'

const _products = [
  {
    "id": 1,
    "picture": pictures.apple,
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
    "id": 2,
    "picture": pictures.orange,
    "name": "Orange Docen",
    "price": 120.99,
    "basePrice": 120.99,
    "inventory": 5,
    "quantity": 1,
    "description": "Just one docen of oranges.",
    "bulk": "docen",
    "bulks": [
      {
        "label": "docen",
        "quantity": 12,
        "factor": 11.2
      }
    ]
  },
  {
    "id": 3,
    "picture": pictures.tomato,
    "name": "Tomato",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 5,
    "quantity": 1,
    "description": "Just one tomato."
  },
  {
    "id": 4,
    "picture": pictures.blueberry,
    "name": "Blueberry",
    "price": 39.99,
    "basePrice": 39.99,
    "inventory": 1,
    "quantity": 1,
    "description": "Some blueberries."
  },
  {
    "id": 5,
    "picture": pictures.durian,
    "name": "Durian",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Hmmm smells weird."
  },
  {
    "id": 6,
    "picture": pictures.dragon,
    "name": "Dragon Fruit",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just one dragon fruit."
  },
  {
    "id": 7,
    "picture": pictures.kiwi,
    "name": "Kiwi",
    "price": 19.99,
    "basePrice": 19.99,
    "inventory": 3,
    "quantity": 1,
    "description": "Just one kiwi."
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
