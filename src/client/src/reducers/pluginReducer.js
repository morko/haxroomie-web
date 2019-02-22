let defaultState = {
  list: [],
  getPluginsError: ''
}

function plugin(state = defaultState, action) {

  switch (action.type) {

    case 'CALL_HHM_RESULT':
      return onHHMResult(state, action);

    case 'CALL_HHM_ERROR':
      return onHHMError(state, action);

    case 'HHM_EVENT':
      return onHHMEvent(state, action)

    default:
      return state;
  }
}

function onHHMError(state, action) {
  switch (action.payload.fn) {
    case 'getPlugins':
      return Object.assign({}, state, {
        getPluginsError: action.payload.msg,
        list: action.payload.result || []
      });
    default:
      console.error(action);
      return state;
  }
}

function onHHMResult(state, action) {

  switch (action.payload.fn) {
    case 'getPlugins':
      return Object.assign({}, state, {
        getPluginsError: '',
        list: action.payload.result || []
      });
    default:
      return state;
  }
}

function onHHMEvent(state, action) {

  let args = action.payload.args || {};
  let plugin = args.plugin || {};
  let pluginSpec = plugin.pluginSpec || {};

  switch(action.payload.eventType) {

    case 'pluginEnabled':
      return Object.assign({}, state, {
        list: updatePlugin(state.list, pluginSpec.name, {
          isEnabled: true
        })
      });

    case 'pluginDisabled':
      return Object.assign({}, state, {
        list: updatePlugin(state.list, pluginSpec.name, {
          isEnabled: false
        })
      });

    case 'pluginLoaded':
      return Object.assign({}, state, {
        list: addPlugin(state.list, plugin)
      });

    case 'pluginRemoved':
      return Object.assign({}, state, {
        list: removePlugin(state.list, plugin)
      });

    default:
      return state;
  }
}

/**
 * Finds the plugin with given name from the given plugin list and then updates
 * its properties with the give properties object. Does not mutate
 * the original list, but instead returns a new list containing
 * the updated values.
 * 
 * @param {Array} list plugin list
 * @param {string} name name of the plugin
 * @param {object} properties properties to update
 * @returns {Array} new plugin list
 */
function updatePlugin(list, name, properties) {
  return list.map((p, i) => {
    if (p.pluginSpec.name === name) {
      return Object.assign({}, list[i], properties);
    }
    return p;
  });
}

/**
 * Checks if the given list has plugin with given name.
 * @param {array} list plugin list
 * @param {string} name name of the plugin
 * @returns {number} -1 if it does not contain the plugin OR the plugins index
 */
function hasPlugin(list, name) {
  for (let i = 0; i < list; i++) {
    if (list[i].pluginSpec.name === name) {
      return i;
    }
  }
  return -1;
}

/**
 * Adds the plugin to the list or replaces one with the same name.
 * Does not mutate original list, but instead returns a new list containing
 * the plugin.
 * 
 * @param {Array} list plugin list
 * @param {object} plugin the plugin to add
 * @returns {Array} new plugin list
 */
function addPlugin(list, plugin) {
  let i = hasPlugin(plugin.pluginSpec.name);
  if (i < 0) {
    return list.concat([plugin]);
  }
  return list.slice()[i] = plugin;
}

/**
 * Removes the plugin from the list.
 * Does not mutate original list, but instead returns a new list.
 * 
 * @param {Array} list plugin list
 * @param {object} plugin the plugin to remove
 * @returns {Array} new plugin list
 */
function removePlugin(list, plugin) {
  let i = hasPlugin(plugin.pluginSpec.name);
  if (i < 0) {
    return list.concat([plugin]);
  }
  return list.splice(i, 1);
}

export default plugin;