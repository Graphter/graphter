interface SignificantData {
  name: string,
  description?: string,
  keyValues?: Array<{ key: string, value: string | number }>
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]
const guessingDescriptions = [ 'description', 'body', 'subtext', 'metadata' ]
const guessingIds = [ 'id', 'identifier', 'key' ]

const extractSignificantData = (data: any): SignificantData => {
  const dataType = typeof data
  if(dataType === 'undefined') return { name: 'Empty' }
  if(dataType === 'string' || dataType === 'number') return { name: data.toString() }
  if(Array.isArray(data)){
    const arrayItemsSignificantData = data.map<SignificantData>(extractSignificantData)
    const arrayItemNames = arrayItemsSignificantData.map((itemSignificantData: SignificantData) => itemSignificantData.name)
    if(arrayItemNames.length > 3) return {
      name: `${arrayItemNames.slice(0, 2).join(', ')}...`
    }
    return {
      name: arrayItemNames.join(', ')
    }
  }

  let dataEntries = new Map(
    Object.entries(data)
      .map(([ key, value ]) => [ key.toLowerCase(), value ])
  )
  const significantData: SignificantData = {
    name: 'Empty',
    keyValues: []
  }
  guessingNames.some(nameGuess => {
    if (dataEntries.has(nameGuess)) {
      const name = dataEntries.get(nameGuess)
      if(typeof name === 'string'){
        significantData.name = name
        dataEntries.delete(nameGuess)
        return true
      }
    }
    return false
  })
  guessingDescriptions.some(descriptionGuess => {
    if (dataEntries.has(descriptionGuess)) {
      const description = dataEntries.get(descriptionGuess)
      if(typeof description === 'string'){
        significantData.description = description
        dataEntries.delete(descriptionGuess)
        return true
      }
    }
    return false
  })
  const keyValues: Array<{ key: string, value: string | number }> = []
  dataEntries.forEach((value, key) => {
    if (
      typeof value === 'string' &&
      guessingIds.indexOf(key) === -1 &&
      keyValues.length <= 10
    ) {
      keyValues.push({key, value})
    }
  })
  significantData.keyValues = keyValues
  return significantData
}

export const dataDisplayUtils = {
  extractSignificantData
}

export default dataDisplayUtils