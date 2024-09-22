// this is built in from node 20
const toReversed = (array) => {
  const reversed = Array(array.length);
  for (let index = array.length - 1; 0 <= index; index--) {
    reversed[array.length - 1 - index] = array[index];
  }
  return reversed;
};

// this is built in from node 20
const toSpliced = (array, start, deleteCount, ...items) => {
  const spliced = array
    .slice(0, start)
    .concat(items)
    .concat(array.slice(start + deleteCount));
  return spliced;
};

const permutations = (items) => {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map(
      (permutation) => [item].concat(permutation),
    ),
  );
};

const everyAdjacencyPermutation = (adjacencyList) => {
  const keys = Object.keys(adjacencyList);
  if (keys.length === 0) return [{}];
  const key0 = keys[0];
  const neighbors = adjacencyList[key0];
  const first = permutations(neighbors).map((e) => ({
    [key0]: e,
  }));
  const { [key0]: _, ...rest } = adjacencyList;
  const rest0 = everyAdjacencyPermutation(rest);
  return first.map((f) => rest0.map((r) => ({ ...f, ...r }))).flat(1);
};

const depthFirstTraversal = (
  adjacency,
  node,
  visited = new Set(),
  traversal = [],
) => {
  if (Object.keys(adjacency).length === 0) return [];
  traversal.push(node);
  visited.add(node);
  adjacency[node].forEach((node) => {
    if (!visited.has(node)) {
      depthFirstTraversal(adjacency, node, visited, traversal);
    }
  });
  return traversal;
};

const everyDepthFirstTraversal = (adjacency, node) =>
  everyAdjacencyPermutation(adjacency).reduce(
    ([depthFirsts, depthFirstsSet], adjacency0) =>
      ((traversal) =>
        ((traversalKey) =>
          depthFirstsSet.has(traversalKey)
            ? [depthFirsts, depthFirstsSet]
            : [[...depthFirsts, traversal], depthFirstsSet.add(traversalKey)])(
          JSON.stringify(traversal),
        ))(depthFirstTraversal(adjacency0, node)),
    [[], new Set()],
  )[0];

if (typeof [].toReversed === "undefined") {
  Array.prototype.toReversed = function () {
    return toReversed(this);
  };
}

if (typeof [].toSpliced === "undefined") {
  Array.prototype.toSpliced = function () {
    return permutations(this);
  };
}

if (typeof [].permutations === "undefined") {
  Array.prototype.permutations = function () {
    return permutations(this);
  };
}

module.exports = {
  toSpliced,
  toReversed,
  permutations,
  depthFirstTraversal,
  everyAdjacencyPermutation,
  everyDepthFirstTraversal,
};
