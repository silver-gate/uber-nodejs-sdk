const axios = require('axios');
const qs = require('qs');

const MAX_RETRIES = 2;

module.exports = class Uber {
  constructor({
    version = 'v1',
    authUrl = 'https://login.uber.com/oauth/v2/token',
    clientId,
    clientSecret,
    customerId,
    scope = 'eats.deliveries',
    debug,
  }) {
    this.authUrl = authUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.customerId = customerId;
    this.version = version;
    this.scope = scope;
    this.debug = debug;
  }

  log(data) {
    if (this.debug) {
      console.log(data); // eslint-disable-line no-console
    }
  }

  async getApiHeaders(force = false) {
    const { accessTokenExpiredAt } = this;

    if (force
      || !accessTokenExpiredAt
      || (accessTokenExpiredAt && accessTokenExpiredAt < Date.now())
    ) {
      await this.getAccessToken();
    }

    const { accessToken } = this;

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  getApiUrl(path) {
    const {
      version,
      customerId,
    } = this;
    return `https://api.uber.com/${version}/customers/${customerId}${path}`;
  }

  async getAccessToken() {
    const {
      clientId,
      authUrl,
      scope,
      clientSecret,
    } = this;

    const options = {
      method: 'POST',
      url: authUrl,
      data: qs.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const {
      access_token: accessToken,
      expires_in: accessTokenExpiredAt,
    } = await this.request(options);

    this.accessToken = accessToken;
    this.accessTokenExpiredAt = Date.now() + accessTokenExpiredAt * 1000;
  }

  async request(payload, inRetries = 0) {
    try {
      this.log(payload);
      const { data } = await axios(payload);
      return data;
    } catch (e) {
      this.log(e);

      if (e.response && e.response.status === 403 && inRetries < MAX_RETRIES) {
        this.log('Retry for 403');
        Object.assign(payload, {
          headers: await this.getApiHeaders(true),
        });
        return this.request(payload, inRetries + 1);
      }

      if (e.response && e.response.data && e.response.data.message) {
        throw new Error(e.response.data.message);
      }

      throw new Error(e.toJSON().message);
    }
  }

  async createQuote(order) {
    const options = {
      method: 'POST',
      url: this.getApiUrl('/delivery_quotes'),
      data: order,
      headers: await this.getApiHeaders(),
    };

    return this.request(options);
  }

  async createDelivery(order) {
    const options = {
      method: 'POST',
      url: this.getApiUrl('/deliveries'),
      data: order,
      headers: await this.getApiHeaders(),
    };

    return this.request(options);
  }

  async cancelDelivery(deliveryId) {
    const options = {
      method: 'POST',
      url: this.getApiUrl(`/deliveries/${deliveryId}/cancel`),
      data: {},
      headers: await this.getApiHeaders(),
    };

    return this.request(options);
  }

  async listDeliveries() {
    const options = {
      method: 'GET',
      url: this.getApiUrl('/deliveries'),
      headers: await this.getApiHeaders(),
    };

    return this.request(options);
  }

  async getDelivery(deliveryId) {
    const options = {
      method: 'GET',
      url: this.getApiUrl(`/deliveries/${deliveryId}`),
      headers: await this.getApiHeaders(),
    };

    return this.request(options);
  }
};
