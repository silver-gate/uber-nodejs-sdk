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

```javascript
{
  account_id: '',
  created: '2023-03-22T12:44:24.816Z',
  customer_id: 'XXX',
  data: {
    complete: false,
    courier_imminent: false,
    created: '2023-03-22T12:44:04.535Z',
    currency: 'twd',
    dropoff: {
      address: '{"state":"新北市","city":"板橋區","street_address":["雙北廢棄物清理公司"],"zip_code":220}',
      detailed_address: [Object],
      location: [Object],
      name: '李先生 P.',
      notes: '消費者輸入內容',
      phone_number: '+886936218903',
      verification: [Object],
      verification_requirements: [Object]
    },
    dropoff_deadline: '2023-03-22T13:30:38Z',
    dropoff_eta: '2023-03-22T13:00:00.072Z',
    dropoff_ready: '2023-03-22T12:44:08Z',
    external_id: '{{平台名稱}}取貨編碼: A054-MXM744',
    fee: 700,
    id: 'del_Ndl2jEExRwagf5F6Swavxw',
    kind: 'delivery',
    live_mode: false,
    manifest: {
      description: '1 X 雞腿便當\n',
      reference: '{{平台名稱}}取貨編碼: A054-MXM744',
      total_value: 20000
    },
    manifest_items: [ [Object] ],
    pickup: {
      address: 'Fu Zhong Rd. 29-1, Banqiao District 220, TW',
      detailed_address: [Object],
      external_store_id: 'local-test-1679489043278',
      location: [Object],
      name: '某某自助餐',
      notes: '描述第一行',
      phone_number: '+88602345678'
    },
    pickup_action: 'default',
    pickup_deadline: '2023-03-22T13:04:04Z',
    pickup_eta: '2023-03-22T12:58:34.072Z',
    pickup_ready: '2023-03-22T12:44:08Z',
    quote_id: 'dqt_Ndl2jEExRwagf5F6Swavxw',
    status: 'pending',
    tracking_url: 'https://www.ubereats.com/tw/orders/35d9768c-4131-4706-a07f-917a4b06afc7',
    undeliverable_action: '',
    undeliverable_reason: '',
    updated: '2023-03-22T12:44:24.743Z',
    uuid: '35D9768C41314706A07F917A4B06AFC7'
  },
  delivery_id: 'del_Ndl2jEExRwagf5F6Swavxw',
  developer_id: '',
  id: 'evt_GbjOM1ikTkOWcwavsNkZYA',
  kind: 'event.delivery_status',
  live_mode: false,
  status: 'pending'
}
```