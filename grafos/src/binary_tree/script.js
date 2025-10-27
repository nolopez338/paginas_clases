/* Random Binary Tree using HTML elements (no SVG/Canvas)
   - Generates a valid binary tree with up to L layers and N nodes (N ≤ 2^L - 1)
   - Renders nodes on a CSS grid with 2^L columns
   - Edges are absolutely positioned <div> lines inside the same host
   - Toggle between circle mode and text-input mode without changing layout
*/

(function () {
  const layersEl = document.querySelector('#layers');
  const nodesEl = document.querySelector('#nodes');
  const form = document.querySelector('#controls');
  const toggle = document.querySelector('#modeToggle');
  const grid = document.querySelector('#grid');
  const host = document.querySelector('#treeHost');
  const hint = document.querySelector('#hint');

  // App state
  let state = {
    layers: 4,
    nodes: 10,
    mode: 'circle', // 'circle' | 'text'
    tree: null,     // { nodes: Map<id, node>, edges: [ [parentId, childId], ... ] }
  };

  // Node model: { id, label, depth, heapIndex, parentId, leftId, rightId }

  // Utilities
  const clampInt = (v, min, max) => Math.max(min, Math.min(max, Math.floor(v)));
  const maxNodesForLayers = L => Math.pow(2, L) - 1;

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Build a random binary tree with exactly N nodes and at most L layers
  function buildRandomTree(L, N) {
    const Nmax = maxNodesForLayers(L);
    if (N > Nmax) N = Nmax;

    let idCounter = 1;
    const nodes = new Map();
    const edges = [];

    // Create root
    const root = {
      id: String(idCounter++),
      label: 'node 1',
      depth: 1,
      heapIndex: 1,
      parentId: null,
      leftId: null,
      rightId: null,
    };
    nodes.set(root.id, root);

    // Frontier: nodes that can still accept children (depth < L)
    let frontier = [root];

    while (nodes.size < N && frontier.length > 0) {
      // Only choose candidates that still have at least one free slot
      const candidates = frontier.filter(n =>
        n.depth < L && (n.leftId === null || n.rightId === null)
      );
      if (candidates.length === 0) break;

      const parent = randomChoice(candidates);
      const freeSides = [];
      if (parent.leftId === null) freeSides.push('left');
      if (parent.rightId === null) freeSides.push('right');

      const side = randomChoice(freeSides);
      const child = {
        id: String(idCounter),
        label: `node ${idCounter}`,
        depth: parent.depth + 1,
        heapIndex: side === 'left' ? parent.heapIndex * 2 : parent.heapIndex * 2 + 1,
        parentId: parent.id,
        leftId: null,
        rightId: null,
      };

      // Attach
      if (side === 'left') parent.leftId = child.id;
      else parent.rightId = child.id;
      nodes.set(child.id, child);
      edges.push([parent.id, child.id]);

      // Child can accept children if depth < L
      if (child.depth < L) frontier.push(child);

      // If parent is now full or reached max depth, remove it from frontier
      if (
        parent.depth >= L ||
        (parent.leftId !== null && parent.rightId !== null)
      ) {
        frontier = frontier.filter(n => n.id !== parent.id);
      }

      idCounter++;
    }

    return { nodes, edges, layers: L };
  }

  // Compute grid placement for a node:
  // columns = 2^L; for depth d, offset = heapIndex - 2^(d-1) + 1
  // column = (2*offset - 1) * 2^(L - d)
  function gridPosition(L, d, heapIndex) {
    const cols = Math.pow(2, L);
    const offset = heapIndex - Math.pow(2, d - 1) + 1; // 1..2^(d-1)
    const step = Math.pow(2, L - d);
    const column = (2 * offset - 1) * step; // 1-based
    return { row: d, col: column, cols };
  }

  // Helper: rect of el relative to rootEl (host)
  function rectRelativeTo(el, rootEl) {
    const r1 = el.getBoundingClientRect();
    const r2 = rootEl.getBoundingClientRect();
    return {
      left: r1.left - r2.left,
      top: r1.top - r2.top,
      width: r1.width,
      height: r1.height
    };
  }

  // Helper: anchor point of a .node wrapper's visible child (circle or input)
  // pos = 'top' | 'bottom'
  function anchorOf(nodeWrapper, pos, rootEl) {
    const inner = nodeWrapper.firstElementChild || nodeWrapper;
    const r = rectRelativeTo(inner, rootEl);
    const x = r.left + r.width / 2;
    const y = pos === 'top' ? r.top : (r.top + r.height);
    return { x, y };
  }

  // Render nodes according to state.mode, and draw edges
  function render() {
    const { layers: L, mode, tree } = state;
    if (!tree) return;

    // Setup grid columns/rows
    const columns = Math.pow(2, L);
    grid.style.setProperty('--rows', L);
    grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

    // Clear node DOM (but not edges; drawEdges will handle edge cleanup)
    grid.innerHTML = '';

    // Create node elements
    const byId = tree.nodes;
    const nodesArray = Array.from(byId.values()).sort((a,b) => a.heapIndex - b.heapIndex);

    for (const node of nodesArray) {
      const { row, col } = gridPosition(L, node.depth, node.heapIndex);
      const wrapper = document.createElement('div');
      wrapper.className = 'node';
      wrapper.dataset.id = node.id;
      wrapper.style.gridRow = `${row}`;
      wrapper.style.gridColumn = `${col}`;

      if (mode === 'circle') {
        const div = document.createElement('div');
        div.className = 'circle';
        div.textContent = node.id;
        wrapper.appendChild(div);
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = node.label || `node ${node.id}`;
        input.placeholder = `node ${node.id}`;
        input.addEventListener('input', (e) => {
          // Keep model label in sync
          const n = byId.get(node.id);
          if (n) n.label = String(e.target.value);
        });
        wrapper.appendChild(input);
      }

      grid.appendChild(wrapper);
    }

    // Draw edges after nodes are in DOM
    drawEdges();
  }

  // Draw edges from parent bottom-center to child top-center
  function drawEdges() {
    if (!state.tree) return;

    // Clear existing edges
    host.querySelectorAll('.edge').forEach(e => e.remove());

    for (const [pid, cid] of state.tree.edges) {
      const pEl = grid.querySelector(`.node[data-id="${pid}"]`);
      const cEl = grid.querySelector(`.node[data-id="${cid}"]`);
      if (!pEl || !cEl) continue;

      const p = anchorOf(pEl, 'bottom', host);
      const c = anchorOf(cEl, 'top', host);

      const dx = c.x - p.x;
      const dy = c.y - p.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const edge = document.createElement('div');
      edge.className = 'edge';
      edge.style.width = `${dist}px`;
      edge.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${angle}deg)`;
      host.appendChild(edge);
    }
  }

  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const Lraw = Number(layersEl.value);
    const Nraw = Number(nodesEl.value);
    const L = clampInt(Lraw, 1, 16);
    const Nmax = maxNodesForLayers(L);
    const N = clampInt(Nraw, 1, Nmax);

    if (Nraw > Nmax) {
      hint.textContent = `Adjusted nodes to ${N} because max for ${L} layers is ${Nmax}.`;
      hint.style.color = 'var(--accent-2)';
    } else {
      hint.textContent = 'Tip: max nodes for L layers is 2^L − 1. Layout remains fixed when toggling.';
      hint.style.color = 'var(--muted)';
    }

    state.layers = L;
    state.nodes = N;
    state.tree = buildRandomTree(L, N);
    render();
  });

  toggle.addEventListener('change', () => {
    state.mode = toggle.checked ? 'text' : 'circle';
    render(); // Re-render nodes; positions stay fixed
  });

  // Redraw edges when layout or sizes change
  const ro = new ResizeObserver(() => drawEdges());
  ro.observe(host);
  ro.observe(grid);

  // Also redraw on window resize and after fonts load
  window.addEventListener('resize', () => drawEdges());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => drawEdges());
  }

  // Initial render
  (function init() {
    state.tree = buildRandomTree(state.layers, state.nodes);
    render();
  })();
})();
