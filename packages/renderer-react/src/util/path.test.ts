import { getValue, validate } from "./path";

describe('path', () => {
  describe('validate()', () => {
    it.each([
      {path: [ ]},
      {path: [ 'page' ]},
      {path: [ 'page', 0 ]},
      {path: [ 'page', 0, 'title' ]}
    ])
    ('should return valid for valid path (%o)', (validPath) => {
      const result = validate(validPath.path)
      expect(result.valid).toBe(true)
    })
    it.each([ null, undefined ])
    ('should return invalid if the path is %s', (emptyPath) => {
      const result = validate(emptyPath)
      expect(result.valid).toBe(false)
      expect(result.reason).toMatchSnapshot()
    })
    it.each([ 'path', 0, 2, {} ])
    ('should return invalid if the path is not an array (%s)', (nonArrayPath) => {
      // @ts-ignore
      const result = validate(nonArrayPath)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('Path is not an array')
    })
    it.each([
      null,
      undefined,
      {},
      []
    ])('should return invalid if any of the segments are of the wrong type (%s)', (invalidSegment) => {
      // @ts-ignore
      const result = validate([ 'page', invalidSegment, 0 ])
      expect(result.valid).toBe(false)
      expect(result.reason).toMatchSnapshot()
    })
  })
  describe('getValue()', () => {
    it.each([
      [ [], 'the-value' ],
      [ [ 'foo' ], { foo: 'the-value' } ],
      [ [ 'foo', 'bar' ], { foo: { bar: 'the-value'} } ],
      [ [ 'foo', 0 ], { foo: [ 'the-value' ] } ],
      [ [ 'foo', 0, 'bar' ], { foo: [ { bar: 'the-value'} ] } ],
      [ [ 'foo', 1, 'baz' ], { foo: [ { bar: 'some-other-value'}, { baz: 'the-value'} ] } ],
    ])
    ('should return the correct value when looking for %o in %o', (path, data) => {
      const result = getValue(data, path)
      expect(result).toBe('the-value')
    })
    describe.each([
      [ [ 'foo', 0, 'bar' ], 'the-value' ],
      [ [ 'foo', 0, 'bar' ], { foo: 'the-value' } ],
      [ [ 'foo', 0, 'bar' ], { foo: [ 'the-value' ] } ],
    ])('when data cannot be found at path %o in %o', (path, data) => {
      it('should return the default value if supplied', () => {
        const result = getValue(data, path, 'the-default-value')
        expect(result).toBe('the-default-value')
      })
      it('should error if default value is not defined', () => {
        expect.assertions(1)
        try {
          getValue(data, path)
        } catch(err) {``
          expect(err).toMatchSnapshot()
        }
      })
    })
    it.each([null, undefined, {}, []])
    ('should error if it comes across bad path segment %o', (badSegment) => {
      expect.assertions(1)
      try {
        // @ts-ignore
        getValue({ some: { nested: 'data' } }, [ 'some', badSegment ])
      } catch(err) {
        expect(err).toMatchSnapshot()
      }
    })
    it('should not mutate the path', () => {
      const path = [ 'some' ]
      Object.freeze(path)
      getValue({ some: { nested: 'data' } }, path)
    })
  })
})

export {}