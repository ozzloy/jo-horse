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

const depthFirst = (adjacency, node, visited = new Set(), traversal = []) => {
  traversal.push(node);
  visited.add(node);
  adjacency[node].forEach((node) =>
    !visited.has(node) ? depthFirst(adjacency, node, visited, traversal) : null,
  );
  return traversal;
};

const everyDepthFirst = (adjacency, node) =>
  new Set(
    everyAdjacencyPermutation(adjacency).map((adjacency0) =>
      JSON.stringify(depthFirst(adjacency0, node)),
    ),
  );

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
  depthFirst,
  everyAdjacencyPermutation,
  everyDepthFirst,
};