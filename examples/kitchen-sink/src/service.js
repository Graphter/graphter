const numberOfPages = 1097
let pages = [...new Array(numberOfPages)].map((_, i) => {
  return {
    id: i,
    title: `Some name ${i}`,
    description: `Some descriptive text ${i}`,
    authors: [
      {
        name: `Joe Bloggs ${i}`,
        location: 'Paris'
      }
    ],
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean condimentum varius lacus, id rhoncus ante pretium vestibulum. Vestibulum facilisis libero non lacus imperdiet, ac lacinia massa venenatis ${i}`,
    tags: [
        'sport',
        'adventure',
        'leisure',
        'hiking'
    ],
    version: 1,
    created: new Date(),
    updated: new Date(),
    deleted: false
  }
});


export default {
  list: (modelId, skip = 0, take = 10) => {
    return Promise.resolve({
      count: pages.length,
      skip: 0,
      take: 10,
      items: pages.slice(skip || 0, (skip || 0) + (take || 10))
    });
  },
  get: (modelId, instanceId) => {
    const page = pages.find(page => page.id === instanceId);
    if(!page) return null;
    return Promise.resolve({
      item: page,
      version: page.version,
      created: page.created,
      updated: page.updated,
      deleted: page.deleted
    });
  },
  save: (modelId, instance) => {
    if(typeof instance.id === 'undefined' || instance.id === null){
      instance.version = 1;
      instance.created = new Date();
      instance.updated = new Date();
      pages.push(instance);
      return {
        item: instance,
        version: 1,
        created: instance.created,
        updated: instance.updated
      };
    } else {
      const pageIndex = pages.findIndex(page => page.id === instance.id);
      if(pageIndex === -1) throw new Error(`Couldn't find an element in store with that ID`);
      instance.updated = new Date();
      instance.version = pages[pageIndex].version++;
      pages[pageIndex] = instance;
      return {
        item: instance,
        version: instance.version,
        updated: instance.updated
      };
    }
  }
}