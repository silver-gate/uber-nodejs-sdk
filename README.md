# uber-nodejs-sdk

## GetStarted

```bash
npm i --save uber-nodejs-sdk
```

```js
const Uber = require('uber-nodejs-sdk');

const uber = new Uber({
  clientId,
  clientSecret,
  customerId,
  debug: true,
});

// Bearer token will be generated when calling the apis.
```

## Documentations

- [API Docs](https://developer.uber.com/docs/deliveries/direct/guides/getting-started)
- [Backoffice](https://direct.uber.com/)

### Webhook sample

#### Delivery status

- pending - Delivery has been accepted but does not yet have a courier assigned
- pickup - Courier is assigned and is en route to pick up the items
- pickup_complete - Courier is moving towards the dropoff
- dropoff - Courier is moving towards the dropoff
- delivered - Courier has completed the dropoff
- canceled - Delivery has been canceled. This could either be due to use of CancelDelivery endpoint or an internal reaso
- returned - The delivery was canceled and a new delivery created to return items to the sender. (See related_deliveries in delivery object.)

```json
{
  "status": "pickup_complete",
  "kind": "event.delivery_status",
  "created": "2022-04-14T17:39:18.287Z",
  "live_mode": true,
  "delivery_id": "XXXXXXXXXXXXXXXX",
  "id": "evt_XXXXXXXXXXXXX",
  "data": {
    "id": "del_XXXXXXXXXXXXX",
    "quote_id": "dqt_XXXXXXXXXXXXX",
    "status": "pickup_complete",
    "complete": false,
    "kind": "delivery",
    "pickup": {
      "name": "XXXXXXXXX",
      "phone_number": "+15555555555",
      "address": "XXXXXXXXXXXXX, Test City, CA 99999-9999, US",
      "detailed_address": {
        "street_address_1": "XXXXXXXXXXXXX",
        "street_address_2": "",
        "city": "Test City",
        "state": "CA",
        "zip_code": "XXXXX-XXXX",
        "country": "US"
      },
      "notes": "",
      "location": {
        "lat": 99.99999,
        "lng": -99.99999
      },
      "verification_requirements": {
        "barcodes": [
          {
            "type": "QR",
            "value": "XXXXXXXXXXXXX-1"
          }
        ]
      },
      "status": "completed",
      "status_timestamp": "2022-04-14T17:39:18.187Z"
    },
    "dropoff": {
      "name": "Zach Z.",
      "phone_number": "+15555555555",
      "address": "XXXXXXXXXXXXX, 406, Test City, CA, 99999-9999",
      "detailed_address": {
        "street_address_1": "XXXXXXXXXXXXX",
        "street_address_2": "",
        "city": "Test City",
        "state": "",
        "zip_code": "99999-9999",
        "country": "US"
      },
      "notes": "",
      "location": {
        "lat": 99.9999,
        "lng": -99.99999
      },
      "verification": {
        "picture": {
          "image_url": "https://tb-static.uber.com/prod/file-upload/uploads/direct-image-capture/XXXXXXXXXXXXX"
        },
        "completion_location": {
          "lat": 99.9999,
          "lng": -99.99999
        }
      },
      "verification_requirements": {
        "picture": true
      }
    },
    "manifest": {
      "reference": "XXXXXXXXXXXXX-1",
      "description": "1 X Cardboard Box\n"
    },
    "manifest_items": [
      {
        "name": "Cardboard Box",
        "quantity": 1,
        "size": "medium",
        "price": 0,
        "dimensions": {
          "length": 27,
          "height": 19,
          "depth": 12
        },
        "must_be_upright": false,
        "weight": 150
      }
    ],
    "created": "2022-04-14T17:28:03.808Z",
    "updated": "2022-04-14T17:39:18.187Z",
    "pickup_ready": "2022-04-14T17:28:04Z",
    "pickup_deadline": "2022-04-14T17:48:04Z",
    "dropoff_ready": "2022-04-14T17:28:04Z",
    "dropoff_deadline": "2022-04-14T18:47:30Z",
    "pickup_eta": "2022-04-14T17:39:18.187Z",
    "dropoff_eta": "2022-04-14T18:03:30.572Z",
    "fee": 1549,
    "currency": "usd",
    "tracking_url": "https://www.ubereats.com/orders/XXXXXXXXXXXXX",
    "undeliverable_action": "",
    "courier_imminent": false,
    "courier": {
      "name": "Cori R.",
      "vehicle_type": "car",
      "phone_number": "+15555555555",
      "location": {
        "lat": 99.999999,
        "lng": -99.99999
      },
      "img_href": "https://XXXXXXXXXXXXX.cloudfront.net/XXXXXXXXXXXXX",
      "rating": "5.00",
      "vehicle_make": "Toyota",
      "vehicle_model": "Prius",
      "location_description": "",
      "vehicle_color": "dimgray"
    },
    "live_mode": true,
    "undeliverable_reason": "",
    "uuid": "XXXXXXXXXXXXX",
    "external_id": "XXXXXXXXXXXXX-1",
    "route_id": "rte_XXXXXXXXXXXXX"
  },
  "customer_id": "cus_XXXXXXXXXXXXX",
  "developer_id": "dev_XXXXXXXXXXXXX",
  "account_id": "acc_XXXXXXXXXXXXX",
  "route_id": "rte_XXXXXXXXXXXXX"
}
```

#### Courier update

```json
{
  "id": "evt_XXXXXXXXXXXXXXXXXXX",
  "location": {
    "lat": 12.345678,
    "lng": -32.168454
  },
  "kind": "event.courier_update",
  "live_mode": true,
  "delivery_id": "del_1bqA1-XXXXXXXXXXXXXX",
  "data": {
    "id": "del_1bqA1-XXXXXXXXXXXXXXXX",
    "quote_id": "dqt_1bqA1-XXXXXXXXXXXXXXXX",
    "status": "delivered",
    "complete": true,
    "kind": "delivery",
    "pickup": {
      "name": "storename",
      "phone_number": "+11111111111",
      "address": "XXXXXXXXXXXXXXXXX",
      "detailed_address": {
        "street_address_1": "XXXXXXXXXXXXXXXX",
        "street_address_2": "",
        "city": "Portland",
        "state": "OR",
        "zip_code": "97210-1430",
        "country": "US"
      },
      "notes": "",
      "location": {
        "lat": 99.99999,
        "lng": -99.99999
      },
      "verification": {
        "barcodes": [
          {
            "type": "QR",
            "value": "XXXXXXXXXX-1",
            "scan_result": {
              "outcome": "SUCCESS",
              "timestamp": "2022-03-29T22:43:43.839Z"
            }
          }
        ]
      },
      "verification_requirements": {
        "barcodes": [
          {
            "type": "QR",
            "value": "XXXXXXXXXX-1"
          }
        ]
      },
      "status": "completed",
      "status_timestamp": "2022-03-29T22:43:44.965Z"
    },
    "dropoff": {
      "name": "Zach Z.",
      "phone_number": "+11111111111",
      "address": "XXXXXXXXXXXXXXXX",
      "detailed_address": {
        "street_address_1": "XXXXXXXXXXXXXXXX",
        "street_address_2": "",
        "city": "Portland",
        "state": "",
        "zip_code": "97209",
        "country": "US"
      },
      "notes": "",
      "location": {
        "lat": 99.99999,
        "lng": -99.99999
      },
      "verification": {
        "picture": {
          "image_url": "https://tb-static.uber.com/XXXXXXXXXXXXXXXXXXXX"
        }
      },
      "verification_requirements": {
        "picture": true
      },
      "status": "completed",
      "status_timestamp": "2022-03-29T22:57:20.129Z"
    },
    "manifest": {
      "reference": "XXXXXXXXX-1",
      "description": "1 x Cardboard Box\n"
    },
    "manifest_items": [
      {
        "name": "Cardboard Box",
        "quantity": 1,
        "size": "medium",
        "price": 0,
        "dimensions": {
          "length": 27,
          "height": 37,
          "depth": 10
        },
        "must_be_upright": false,
        "weight": 120
      }
    ],
    "created": "2022-03-29T21:50:27.554Z",
    "updated": "2022-03-29T22:52:11.404Z",
    "pickup_ready": "2022-03-29T21:50:27Z",
    "pickup_deadline": "2022-03-29T22:10:27Z",
    "dropoff_ready": "2022-03-29T21:50:27Z",
    "dropoff_deadline": "2022-03-29T23:10:27Z",
    "pickup_eta": "2022-03-29T22:43:44.965Z",
    "dropoff_eta": "2022-03-29T22:57:14.161Z",
    "fee": 500,
    "currency": "usd",
    "tracking_url": "https://www.ubereats.com/orders/XXXXXXXXXXXXXXXX",
    "undeliverable_action": "",
    "courier_imminent": true,
    "courier": {
      "name": "Cori R.",
      "vehicle_type": "car",
      "phone_number": "+11111111111",
      "location": {
        "lat": 45.432121,
        "lng": -123.12341
      },
      "img_href": "https://XXXXXXXXXXXXXXXX.cloudfront.net/XXXXXXXXXXXXXXXX",
      "rating": "5.00",
      "vehicle_make": "Ford",
      "vehicle_model": "Focus",
      "location_description": "",
      "vehicle_color": "white"
    },
    "live_mode": true,
    "undeliverable_reason": "",
    "uuid": "XXXXXXXXXXXXXXXX",
    "external_id": "XXXXXXXXX-1",
    "route_id": "rte_XXXXXXXXXXXXXXXX"
  },
  "created": "2022-03-29T22:56:45.895Z"
}
```