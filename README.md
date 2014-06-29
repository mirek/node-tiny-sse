
## Summary

Server Sent Events (SSE) support for express/connect.

Why SSE and not WebSockets/socket.io? Because:

 * it's based on pure HTTP
 * works with elastic beanstalk load balancer, proxies like nginx, etc.
 * it'll run your middleware chain normally in express/connect, just like for any other HTTP request (ie.
   authentication, setting up locals etc.)
 * you don't need to store any state, everything happens in stateless http request (no need for redis backed state,
   even for load balanced environment)
 * much simpler than WebSockets

What is it good for?

  * any server generated push notifications
  * one-off, long running tasks that you want to have progress indication for

## Installation

    npm install tiny-sse --save

## Usage

    sse = require 'tiny-sse'

    ...

    app.get '/foo/bar', sse.head(), sse.ticker(seconds: 15), (req, res) ->
      sse.send(event: 'foo', data: 'Hello')(req, res)
      req.end()
