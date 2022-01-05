import { EventDispatcher } from './EventDispatcher'

function Defer() {
  const self = this;
  self.promise = new Promise((resolve, reject) => {
    self.resolve = resolve;
    self.reject = reject;
  });
}

class Fiscalberry extends EventDispatcher {
  isConnected = false;
  ws: WebSocket = null;
  deferred = new Defer();

  connect(host = "localhost", port = 12000, uri = 'ws', ssl = false) {
    let wsURI = ssl ? 'wss' : 'ws';
    let url = `${wsURI}://${host}:${port}/${uri}`
    this.ws = new WebSocket(url)
    this.ws.addEventListener('open', (e: Event) => {
      this.isConnected = true
      this.dispatchEvent({ type: 'open', message: `Connection open at ${url}` })
      this.deferred.resolve(this.ws)
    })
    this.ws.addEventListener('error', (e: Event) => {
      this.isConnected = false
      this.dispatchEvent({ type: 'error', message: e })
      this.deferred.reject(e)
    })
    this.ws.addEventListener('close', (e: CloseEvent) => {
      this.isConnected = false
      this.dispatchEvent({ type: 'close', messsage: 'Connection closed' })
    })
    this.ws.addEventListener('message', (e: MessageEvent) => {
      const response = JSON.parse(e.data)
      if (response) {
        this.handleWSMessage(response);
        this.handleFbMsg(response);
        this.handleFbRta(response);
        this.handleFbErr(response);
      }
    })
  }

  send() {
    const args = arguments
    try {
      if (typeof args[0] == 'string') {
        return this.ws.send(args[0])
      } else {
        return this.ws.send(JSON.stringify(args[0]))
      }
    } catch (e) {
      console.log('Send error', e);
    }
  }

  handleFbRta(response: object) {
    const eventName = "fb:rta"
    if (response.hasOwnProperty('rta')) {
      const data = { data: response['rta'] }
      this.dispatchEvent({ type: eventName, message: data })
      function logRta(rtaResponse) {
        if (rtaResponse.hasOwnProperty('action')) {
          const actionName = rtaResponse['action']
          const eventAction = `${eventName}:${actionName}`
          const data = { data: rtaResponse['rta'] }
          this.dispatchEvent({ type: eventAction, message: data })
        }
      }
      if (Array.isArray(response['rta'])) {
        response['rta'].forEach(it => {
          logRta(it)
        })
      } else {
        logRta(response['rta'])
      }
    }
  }

  handleFbErr(response: object) {
    const eventName = "fb:err"
    if (response.hasOwnProperty('err')) {
      const data = { data: response['err'] }
      this.dispatchEvent({ type: eventName, message: data })
    }
  }

  handleFbMsg(response: object) {
    const eventName = 'fb:msg';
    if (response.hasOwnProperty('msg')) {
      const data = { data: response['msg'] }
      this.dispatchEvent({ type: eventName, message: data })
      for (let key in response['msg']) {
        const eventKey = `${eventName}:${key}`
        const data = { data: response['msg'][key] }
        this.dispatchEvent({ type: eventKey, message: data })
      }
    }
  }

  handleWSMessage(response: object) {
    const eventName = "message"
    this.dispatchEvent({ type: eventName, message: { data: response } })
  }
}

const fiscalberry = new Fiscalberry()

export default fiscalberry