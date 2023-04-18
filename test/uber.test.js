require('dotenv').config(); // eslint-disable-line import/no-extraneous-dependencies

const Uber = require('../Uber');

const {
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  CUSTOMER_ID: customerId,
  WEBHOOK_API_SECRET: webhookApiSecret = 'c5c26d5a-70d6-46c7-a652-d7c09825ad29',
} = process.env;

const uber = new Uber({
  clientId,
  clientSecret,
  customerId,
  webhookApiSecret,
  debug: true,
  enableAutoTest: true,
});

let quoteId;
let deliveryId;

jest.setTimeout(10000);

describe('Uber Test', () => {
  test('verifyWebhook', async () => {
    // https://developer.uber.com/docs/deliveries/daas/api/webhook-event-deliverystatus#webhook-security
    const payload = '{"kind": "event.courier_update", "location": {"lat": 37.7974109, "lng": -122.424145}}';
    const expected = 'cdff8133fb065f8d37a2c1c94c3331b6a82766d14e7ea4faacc4886558cedd65';

    expect(uber.verifyWebhook(payload, expected)).toEqual(true);
  });

  test('listDeliveries', async () => {
    const { total_count: total, data } = await uber.listDeliveries();
    console.log('total_count', total);
    expect(Array.isArray(data)).toEqual(true);
    // console.log(data);
    data.forEach((item) => {
      if (item.status === 'delivered') {
        console.log(JSON.stringify(item, null, 2));
      }
    });
  });

  test('create quote', async () => {
    const order = {
      pickup_address: JSON.stringify({
        state: '新北市',
        city: '板橋區',
        street_address: ['府中路２９-１號１樓'],
        zip_code: '220',
      }),
      dropoff_address: JSON.stringify({
        state: '新北市',
        city: '板橋區',
        street_address: ['縣民大道一段189號'],
        zip_code: '220',
      }),
      // pickup_ready_dt: new Date(Date.now() + 5000).toISOString(),
      manifest_total_value: 200 * 100,
      external_store_id: `local-test-${Date.now()}`,
      // pickup_latitude: 25.043913,
      // pickup_longitude: 121.513107,
      // pickup_phone_number: "+88602345678",
      // dropoff_latitude: 25.027194,
      // dropoff_longitude: 121.520798,
      // pickup_deadline_dt
      // dropoff_ready_dt
      // dropoff_deadline_dt
    };

    const response = await uber.createQuote(order);
    console.log(response);
    const {
      kind,
      id,
      currency,
      fee,
    } = response;
    // {
    //   kind: 'delivery_quote',
    //   id: 'dqt_2BEwxACbQx-DNgGBAcG7fA',
    //   created: '2023-03-13T13:39:02.019Z',
    //   expires: '2023-03-13T13:54:02.019Z',
    //   fee: 600,
    //   currency: 'twd',
    //   currency_type: 'TWD',
    //   dropoff_eta: '2023-03-13T13:57:18Z',
    //   duration: 18, // delivery time 18 minutes
    //   pickup_duration: 7, // Estimated minutes until a courier will arrive at the pickup
    //   external_store_id: 'local-test-1678714739838',
    //   dropoff_deadline: '2023-03-13T14:24:25Z'
    // }
    expect(kind).toEqual('delivery_quote');
    expect(id).toBeDefined();
    expect(currency).toEqual('twd');
    expect(fee).toBeGreaterThan(100);

    quoteId = id;
  });

  test('create order', async () => {
    const order = {
      pickup_name: '某某自助餐',
      pickup_business_name: '某某自助餐 公司名稱',
      pickup_phone_number: '+88602345678',
      pickup_notes: '領餐備註第一行\n領餐備註第二行\n領餐備註第三行',
      pickup_address: JSON.stringify({
        state: '新北市',
        city: '板橋區',
        street_address: ['府中路２９-１號１樓'],
        zip_code: '220',
      }),
      dropoff_address: JSON.stringify({
        state: '新北市',
        city: '板橋區',
        street_address: ['縣民大道一段189號'],
        zip_code: '220',
      }),
      // pickup_ready_dt: new Date(Date.now() + 5000).toISOString(),
      external_id: `local-test-${Date.now()}`,
      external_store_id: `local-test-${Date.now()}`,
      // order specific
      quote_id: quoteId,
      dropoff_name: '送餐對象名字',
      dropoff_phone_number: '+8860936218903',
      manifest_reference: '送餐大使領餐用編號 A054-MXM744',
      manifest_total_value: 200 * 100,
      manifest: '餐點備註第一行\n餐點備註第二行\n餐點備註第三行',
      manifest_items: [
        {
          name: '雞腿便當',
          quantity: 1,
          price: 100 * 100,
        },
      ],
      // 送餐備註
      dropoff_seller_notes: '送餐備註第一行\n送餐備註第二行\n送餐備註第三行',
      // 消費者自己填寫的備註
      dropoff_notes: '消費者自己的備註第一行\n消費者自己的備註第二行\n消費者自己的備註第三行',
      undeliverable_action: 'leave_at_door',
      deliverable_action: 'deliverable_action_meet_at_door',
      dropoff_verification: {
        picture: true,
        signature_requirement: {
          enabled: true,
          collect_signer_name: false,
          collect_signer_relationship: false,
        },
      },
    };

    // {
    //   id: 'del_ZNICOPjERG-HfIRC5yuXtQ',
    //   quote_id: 'dqt_ZNICOPjERG-HfIRC5yuXtQ',
    //   status: 'pending',
    //   complete: false,
    //   kind: 'delivery',
    //   pickup: {
    //     name: '某某自助餐',
    //     phone_number: '+88602345678',
    //     address: '{"state":"新北市","city":"板橋區","street_address":["府中路２９-１號１樓"],"zip_code":220}',
    //     detailed_address: {
    //       street_address_1: 'Fu Zhong Rd. 29-1',
    //       street_address_2: '',
    //       city: 'Banqiao District',
    //       state: '',
    //       zip_code: '220',
    //       country: 'TW'
    //     },
    //     notes: '描述第一行\n描述第二行\n我是第三行',
    //     location: { lat: 25.00842, lng: 121.45862 },
    //     external_store_id: 'local-test-1678715399302'
    //   },
    //   dropoff: {
    //     name: '李先生 Postmates',
    //     phone_number: '+886936218903',
    //     address: '{"state":"新北市","city":"板橋區","street_address":["雙北廢棄物清理公司"],"zip_code":220}',
    //     detailed_address: {
    //       street_address_1: '雙北廢棄物清理公司',
    //       street_address_2: '',
    //       city: '板橋區',
    //       state: '新北市',
    //       zip_code: '220',
    //       country: 'TW'
    //     },
    //     notes: '消費者輸入內容',
    //     location: { lat: 25.004166, lng: 121.45437 },
    //     verification_requirements: { barcodes: null, picture: true }
    //   },
    //   manifest: {
    //     reference: '{{平台名稱}}取貨編碼: A054-MXM744',
    //     description: '1 X 雞腿便當\n',
    //     total_value: 20000
    //   },
    //   manifest_items: [
    //     {
    //       name: '雞腿便當',
    //       quantity: 1,
    //       size: 'small',
    //       price: 10000,
    //       dimensions: [Object],
    //       must_be_upright: false,
    //       weight: 200
    //     }
    //   ],
    //   created: '2023-03-13T13:50:01.639Z',
    //   updated: '1970-01-01T00:00:00Z',
    //   pickup_ready: '2023-03-13T13:50:05Z',
    //   pickup_deadline: '2023-03-13T14:10:01Z',
    //   dropoff_ready: '2023-03-13T13:50:05Z',
    //   dropoff_deadline: '2023-03-13T14:40:26Z',
    //   pickup_eta: '2023-03-13T14:00:19Z',
    //   dropoff_eta: '2023-03-13T14:11:21Z',
    //   related_deliveries: null,
    //   fee: 600,
    //   currency: 'twd',
    //   tracking_url: 'https://www.ubereats.com/tw/orders/64d20238-f8c4-446f-877c-8442e72b97b5',
    //   undeliverable_action: '',
    //   courier_imminent: false,
    //   courier: null,
    //   live_mode: false,
    //   undeliverable_reason: '',
    //   uuid: '64D20238F8C4446F877C8442E72B97B5', // 用作計算單價
    //   fences: null,
    //   external_id: '{{平台名稱}}取貨編碼: A054-MXM744',
    //   items_acquired: null,
    //   state_changes: null,
    //   deliverable_action: 'deliverable_action_meet_at_door',
    //   pickup_action: 'default',
    //   pickup_payment: { requirements: [] },
    //   refunds: null
    // }
    const {
      id,
      status,
      complete,
      kind,
      uuid,
      tracking_url: trackingUrl,
    } = await uber.createDelivery(order);

    expect(id).toBeDefined();
    expect(status).toEqual('pending');
    expect(complete).toEqual(false);
    expect(kind).toEqual('delivery');
    expect(uuid).toBeDefined();
    expect(trackingUrl).toBeDefined();

    deliveryId = id;
  });

  // test('Get Delivery', async () => {
  //   const {
  //     id,
  //     status,
  //     complete,
  //     kind,
  //   } = await uber.getDelivery(deliveryId);

  //   expect(id).toEqual(deliveryId);
  //   expect(status).toEqual('pending');
  //   expect(complete).toEqual(false);
  //   expect(kind).toEqual('delivery');
  // });

  // // test('Cancel Delivery', async () => {
  // //   await uber.cancelDelivery(deliveryId);

  // //   const {
  // //     id,
  // //     status,
  // //     complete,
  // //     kind,
  // //   } = await uber.getDelivery(deliveryId);

  // //   expect(id).toEqual(deliveryId);
  // //   expect(status).toEqual('canceled');
  // //   expect(complete).toEqual(true);
  // //   expect(kind).toEqual('delivery');
  // // });

  // // test('listDeliveries', async () => {
  // //   const result = await uber.listDeliveries();
  // //   console.log(result);
  // // });
});
