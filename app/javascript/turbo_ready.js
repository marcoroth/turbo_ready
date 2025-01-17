function dispatch (targets, name, options = {}) {
  const evt = new CustomEvent(name, options)
  targets.forEach(t => t.dispatchEvent(evt))
}

function invoke () {
  const payload = JSON.parse(this.templateContent.textContent)
  const { id, selector, receiver, method, args } = payload
  let receivers = [self]
  if (selector) receivers = Array.from(document.querySelectorAll(selector))

  if (receiver) {
    receivers = receivers.map(r => {
      let context = r
      const chain = receiver.split('.')
      while (chain.length > 0) context = context[chain.shift()]
      return context
    })
  }

  // event dispatch
  if (method === 'dispatchEvent')
    return dispatch(receivers, args[0], args[1] || {})

  // property assignment
  if (method.endsWith('='))
    return receivers.forEach(r => (r[method.slice(0, -1).trim()] = args[0]))

  // method invocation
  receivers.forEach(r => r[method].apply(r, args))
}

function initialize (streamActions) {
  streamActions.invoke = invoke
}

export default { initialize }
