
assert = require 'assert'
sse = require '../src'

describe 'linize', ->
  it 'should sanitize input', ->
    assert.equal 1, sse.linize("foo\nbar").split(/\n/).length
