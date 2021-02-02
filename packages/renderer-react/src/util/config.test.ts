import { configUtils } from "./config";

describe('config', () => {
  describe('getAt', () => {

    it('should return the correct config when looking one step deep', () => {
      const result = configUtils.getAt({
        id: 'some-config-id',
        type: 'object',
        children: [ { id: 'another-config-id', type: 'string', } ]
      }, ['another-config-id'])
      expect(result.id).toBe('another-config-id')
    })

    it('should return the correct config when looking two steps deep', () => {
      const result = configUtils.getAt({
        id: 'some-config-id',
        type: 'object',
        children: [
          {
            id: 'another-config-id',
            type: 'list',
            children: [
              { id: 'and-another-config-id', type: 'string' }
            ]
          }
        ]
      }, ['another-config-id', 'and-another-config-id'])
      expect(result.id).toBe('and-another-config-id')
    })

    it('should return the supplied config straight out when an empty path is supplied', () => {
      const result = configUtils.getAt({
        id: 'some-config-id',
        type: 'string'
      }, [])
      expect(result.id).toBe('some-config-id')
    })

    it('should throw an error if no config is found', () => {
      const config = {
        id: 'some-config-id',
        type: 'object',
        children: [
          {
            id: 'another-config-id',
            type: 'list',
            children: [
              { id: 'and-another-config-id', type: 'string' }
            ]
          }
        ]
      }
      expect(() => configUtils.getAt(config, ['another-config-id', 'some-non-existent-config-id']))
        .toThrowErrorMatchingSnapshot()
    })

    it.each([null, undefined, {}, {id: 'some-invalid-config-id'}])
    ('should throw an error if invalid config %o is supplied', (invalidConfig) => {
      // @ts-ignore
      expect(() => configUtils.getAt(invalidConfig, [ 'some-invalid-config-id']))
        .toThrowErrorMatchingSnapshot()
    })

    it.each([[undefined], null, undefined])
    ('should throw an error if invalid path %o is supplied', (invalidPath) => {
      expect(() => configUtils.getAt({
        id: 'some-config-id',
        type: 'object',
        children: [ { id: 'some-child-config-id', type: 'string' } ]
        // @ts-ignore
      }, invalidPath))
        .toThrowErrorMatchingSnapshot()
    })

  })
})

export {}