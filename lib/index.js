(function() {
  var done, head, linize, send, ticker,
    __slice = [].slice;

  head = function() {
    return function(req, res, next) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });
      if (next != null) {
        return next();
      }
    };
  };

  linize = function(a) {
    if (typeof a === 'string') {
      return a.replace(/\n/, '\\n').replace(/\r/, '\\r');
    }
  };

  send = function(params) {
    return function(req, res, next) {
      var e;
      e = null;
      if ((e = params.comment) != null) {
        res.write(": " + (linize(e)) + "\n");
      }
      if ((e = params.retry) != null) {
        res.write("retry: " + (parseInt(e)) + "\n");
      }
      if ((e = params.event) != null) {
        res.write("event: " + (linize(e)) + "\n");
      }
      if ((e = params.id) != null) {
        if (e === false) {
          res.write("id\n");
        } else {
          res.write("id: " + (linize(e)) + "\n");
        }
      }
      if ((e = params.data) != null) {
        res.write("data: " + (JSON.stringify(e)) + "\n");
      }
      res.write("\n");
      if (next != null) {
        return next();
      }
    };
  };

  done = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function(req, res, next) {
      send({
        event: 'done',
        data: args
      })(req, res);
      if (next != null) {
        return next();
      }
    };
  };

  ticker = function(options) {
    var seconds, _ref;
    if (options == null) {
      options = {};
    }
    seconds = (_ref = options.seconds) != null ? _ref : 1;
    return function(req, res, next) {
      var i, interval;
      i = 0;
      interval = setInterval(function() {
        send({
          event: 'ticker',
          data: i
        })(req, res);
        return i++;
      }, seconds * 1000);
      req.on('close', function() {
        return clearInterval(interval);
      });
      if (next != null) {
        return next();
      }
    };
  };

  module.exports = {
    head: head,
    send: send,
    ticker: ticker,
    done: done,
    linize: linize
  };

}).call(this);
