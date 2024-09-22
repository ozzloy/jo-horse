const chai = require("chai");
const expect = chai.expect;
const {
  toReversed,
  toSpliced,
  permutations,
  everyAdjacencyPermutation,
} = require("../index");

describe("toReversed", () => {
  it("reverses an empty array", () => {
    const emptyArray = [];
    expect(toReversed(emptyArray)).to.deep.equal([]);
  });
  it("creates a new array, leaves original array alone", () => {
    const emptyArray = [];
    expect(toReversed(emptyArray)).to.not.equal(emptyArray);

    const filledArray = [6, 2, 8];
    toReversed(filledArray);
    expect(filledArray).to.deep.equal([6, 2, 8]);
  });
  it("reverses [0]", () => {
    expect(toReversed([1])).to.deep.equal([1]);
  });
  it("reverses [0, 1]", () => {
    expect(toReversed([0, 1])).to.deep.equal([1, 0]);
  });
});

describe("toSpliced", () => {
  it("creates a new array, leaves original array alone", () => {
    const emptyArray = [];
    expect(toSpliced(emptyArray)).to.not.equal(emptyArray);

    const filledArray = [6, 2, 8];
    toSpliced(filledArray);
    expect(filledArray).to.deep.equal([6, 2, 8]);
  });

  it("copies input array when deleting 0 items", () => {
    const array = [6, 2, 8, 3, 1];
    for (const start of Array(array.length).keys()) {
      const splicedArray = toSpliced(array, start, 0);
      expect(splicedArray, "same content").to.deep.equal(array);
      expect(splicedArray, "new array").to.not.equal(array);
    }
  });
  it("deletes an item at any index", () => {
    const array = [6, 2, 8, 3, 1];
    const expected = [
      [2, 8, 3, 1],
      [6, 8, 3, 1],
      [6, 2, 3, 1],
      [6, 2, 8, 1],
      [6, 2, 8, 3],
    ];
    for (const start of Array(array.length).keys()) {
      expect(toSpliced(array, start, 1), `start = ${start}`).to.deep.equal(
        expected[start],
      );
    }
  });
  it("adds an item to any index", () => {
    const array = [6, 2, 8];
    const expected = [
      [-1, 6, 2, 8],
      [6, -1, 2, 8],
      [6, 2, -1, 8],
      [6, 2, 8, -1],
    ];
    for (const start of Array(array.length).keys()) {
      expect(toSpliced(array, start, 0, -1), `start = ${start}`).to.deep.equal(
        expected[start],
      );
    }
  });
});

describe("permutations", () => {
  it("computes all permutations of []", () => {
    expect(permutations([])).to.have.deep.members([[]]);
  });
  it("computes all permutations of [6]", () => {
    expect(permutations([6])).to.have.deep.members([[6]]);
  });
  it("computes all permutations of [6, 2]", () => {
    expect(permutations([6, 2])).to.have.deep.members([
      [6, 2],
      [2, 6],
    ]);
  });
  it("computes all permutations of [6, 2, 8]", () => {
    expect(permutations([6, 2, 8])).to.have.deep.members([
      [6, 2, 8],
      [6, 8, 2],
      [2, 6, 8],
      [2, 8, 6],
      [8, 6, 2],
      [8, 2, 6],
    ]);
  });
});

describe("everyAdjacencyPermutation", () => {
  it("finds every adjacency list equivalent to an empty one", () => {
    expect(everyAdjacencyPermutation({})).to.have.deep.members([{}]);
  });
  it("works for adjacency list with 1 node, 1 edge", () => {
    expect(everyAdjacencyPermutation({ 0: [0] })).to.have.deep.members([
      { 0: [0] },
    ]);
  });
  it("works for adjacency list with 2 nodes, 3 directed edges", () => {
    expect(
      everyAdjacencyPermutation({ 0: [0, 1], 1: [0] }),
    ).to.have.deep.members([
      {
        0: [0, 1],
        1: [0],
      },
      {
        0: [1, 0],
        1: [0],
      },
    ]);
  });
  it("works for 3 nodes, 5 directed edges", () => {
    expect(
      everyAdjacencyPermutation({
        0: [0, 1],
        1: [2],
        2: [4, 5],
      }),
    ).to.have.deep.members([
      {
        0: [0, 1],
        1: [2],
        2: [4, 5],
      },
      {
        0: [0, 1],
        1: [2],
        2: [5, 4],
      },
      {
        0: [1, 0],
        1: [2],
        2: [4, 5],
      },
      {
        0: [1, 0],
        1: [2],
        2: [5, 4],
      },
    ]);
  });
  it("works for 4 nodes, 6 directed edges", () => {
    expect(
      everyAdjacencyPermutation({
        0: [0, 1],
        1: [2],
        2: [4],
        3: [6, 7],
      }),
    ).to.have.deep.members([
      {
        0: [0, 1],
        1: [2],
        2: [4],
        3: [6, 7],
      },
      {
        0: [0, 1],
        1: [2],
        2: [4],
        3: [7, 6],
      },
      {
        0: [1, 0],
        1: [2],
        2: [4],
        3: [6, 7],
      },
      {
        0: [1, 0],
        1: [2],
        2: [4],
        3: [7, 6],
      },
    ]);
  });
  it("works for 2 nodes, 1 with 3 edges, 1 with 2 edges", () => {
    expect(
      everyAdjacencyPermutation({
        0: [1, 2, 3],
        4: [5, 6],
      }),
    ).to.have.deep.members([
      {
        0: [1, 2, 3],
        4: [5, 6],
      },
      {
        0: [1, 2, 3],
        4: [6, 5],
      },
      {
        0: [1, 3, 2],
        4: [5, 6],
      },
      {
        0: [1, 3, 2],
        4: [6, 5],
      },
      {
        0: [2, 1, 3],
        4: [5, 6],
      },
      {
        0: [2, 1, 3],
        4: [6, 5],
      },
      {
        0: [2, 3, 1],
        4: [5, 6],
      },
      {
        0: [2, 3, 1],
        4: [6, 5],
      },
      {
        0: [3, 1, 2],
        4: [5, 6],
      },
      {
        0: [3, 1, 2],
        4: [6, 5],
      },
      {
        0: [3, 2, 1],
        4: [5, 6],
      },
      {
        0: [3, 2, 1],
        4: [6, 5],
      },
    ]);
  });
});
