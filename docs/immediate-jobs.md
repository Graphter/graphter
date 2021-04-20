# Immediate Jobs

Very short term plan for upcoming work and priorities

1. ~~Look at removing pathConfig requirement~~
1. ~~Partial tree rendering~~
1. ~~View mode for list items~~
1. ~~Page separation~~
1. ~~Node renderer options config models~~
1. ~~Cleanup:~~
   * ~~Check that tree data callback is efficient and memoize if necessary~~
   * ~~Fix array key error~~
   * ~~Fix async rendering error~~
   * ~~Make all paths global and only convert to local when necessary at time of use~~
1. ~~Better sibling path renderer~~
1. Fill out options config for all renderers
1. Validation summary should display results for all levels of the tree irrespective of current location in it
1. Validation results should link through to model area affected
1. Improve heuristic item display
1. Fix simple (e.g. string) item editing 
    - maybe add the name of the item being added to the "Add" button
    - maybe add "simple" add method to ListNodeRenderer
1. Context aware ID fix
1. Save should output entire tree not just descendents of current location
1. Name and description override to allow children to override how they're displayed
1. Redirect up the path ancestry until valid data is found
1. Look at raising some display responsibility to the parent renderer (?)
  -- E.g in object
  --- title override
  --- title & desc display flag
1. getConfigAt and getConfigsTo should return an array of configs for each path (???)
1. validation could be state provider independent