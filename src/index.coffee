
# Send SSE headers.
head = ->
  (req, res, next) ->
    res.writeHead 200,
      "Content-Type": "text/event-stream"
      "Cache-Control": "no-cache"
      "Connection": "keep-alive"
    next() if next?

# Internal, sanitize values.
#
# @param [String] a
# @return [String]
linize = (a) ->
  if typeof a is 'string'
    a
      .replace /\n/, '\\n'
      .replace /\r/, '\\r'

# Send event or message.
#
# @param [Object] params
# @option params [String] comment
# @option params [Number] retry
# @option params [String] event
# @option params [String] id
# @option params [Object] data
# @return [Function(req, res, next)]
send = (params) ->
  (req, res, next) ->

    e = null

    if (e = params.comment)?
      res.write ": #{linize e}\n"

    if (e = params.retry)?
      res.write "retry: #{parseInt e}\n"

    if (e = params.event)?
      res.write "event: #{linize e}\n"

    if (e = params.id)?
      if e is false
        res.write "id\n"
      else
        res.write "id: #{linize e}\n"

    if (e = params.data)?
      res.write "data: #{JSON.stringify e}\n"

    res.write "\n"

    next() if next?

# Send done event.
#
# @param [Error] err
# @param [Object] resp
# @return [Function(req, res, next)]
done = (args...) ->
  (req, res, next) ->
    send(event: 'done', data: args)(req, res)
    next() if next?

# Setup a ticker on the request.
#
# @param [Object] options
# @option options [Number] seconds
# @return [Function(req, res, next)]
ticker = (options = {}) ->
  seconds = options.seconds ? 1

  (req, res, next) ->
    i = 0
    interval = setInterval ->

      send(event: 'ticker', data: i)(req, res)
      i++
    , seconds * 1000

    # Close ticker on request close.
    req.on 'close', ->
      clearInterval interval

    next() if next?

module.exports = {
  head
  send
  ticker
  done

  # Private, but you're welcome to use them.
  linize
}
