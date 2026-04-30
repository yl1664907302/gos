var Record;
(function (Record) {
  Record[Record["None"] = 0] = "None";
  Record[Record["Start"] = 1] = "Start";
  Record[Record["End"] = 2] = "End";
})(Record || (Record = {}));
function traverseNodesKey(treeData, fieldNames, callback) {
  function processNode(dataNode) {
    const key = dataNode[fieldNames.key];
    const children = dataNode[fieldNames.children];
    if (callback(key, dataNode) !== false) {
      traverseNodesKey(children || [], fieldNames, callback);
    }
  }
  treeData.forEach(processNode);
}
/** 计算选中范围，只考虑expanded情况以优化性能 */
export function calcRangeKeys(_ref) {
  let {
    treeData,
    expandedKeys,
    startKey,
    endKey,
    fieldNames = {
      title: 'title',
      key: 'key',
      children: 'children'
    }
  } = _ref;
  const keys = [];
  let record = Record.None;
  if (startKey && startKey === endKey) {
    return [startKey];
  }
  if (!startKey || !endKey) {
    return [];
  }
  function matchKey(key) {
    return key === startKey || key === endKey;
  }
  traverseNodesKey(treeData, fieldNames, key => {
    if (record === Record.End) {
      return false;
    }
    if (matchKey(key)) {
      // Match test
      keys.push(key);
      if (record === Record.None) {
        record = Record.Start;
      } else if (record === Record.Start) {
        record = Record.End;
        return false;
      }
    } else if (record === Record.Start) {
      // Append selection
      keys.push(key);
    }
    return expandedKeys.includes(key);
  });
  return keys;
}
export function convertDirectoryKeysToNodes(treeData, keys, fieldNames) {
  const restKeys = [...keys];
  const nodes = [];
  traverseNodesKey(treeData, fieldNames, (key, node) => {
    const index = restKeys.indexOf(key);
    if (index !== -1) {
      nodes.push(node);
      restKeys.splice(index, 1);
    }
    return !!restKeys.length;
  });
  return nodes;
}