import { useEffect, useMemo, useRef, useState } from "react";

const START_DELAY_MS = 1000;
const RESEED_DELAY_MS = 2000;
const ABOUT_STEP_INTERVAL_MS = 800;
const ABOUT_MIN_N = 1;
const ABOUT_MAX_N = 20;
const ABOUT_BASE_N = 15;
const ABOUT_START_N = 15;
const ABOUT_TILE_PALETTE = [
  "#21295C",
  "#1B3B6F",
  "#065A82",
  "#1C7293",
  "#9EB3C2",
];
const AGE_COLOR_CYCLE = [
  ...ABOUT_TILE_PALETTE,
  ...ABOUT_TILE_PALETTE.slice(0, -1).reverse(),
];
const MAX_CELL_AGE = AGE_COLOR_CYCLE.length * 2;
const EXPLOSION_INFECTION_PROBABILITY = 0.8;
const DESKTOP_CONTENT_PADDING = 64;
const MOBILE_CONTENT_PADDING = 36;
const DESKTOP_TOPBAR_HEIGHT = 92;
const MOBILE_TOPBAR_HEIGHT = 118;
const DESKTOP_LIFE_HORIZONTAL_PADDING = 56;
const MOBILE_LIFE_HORIZONTAL_PADDING = 20;
const DESKTOP_LIFE_TOP_PADDING = 24;
const MOBILE_LIFE_TOP_PADDING = 12;
const DESKTOP_LIFE_BOTTOM_PADDING = 88;
const MOBILE_LIFE_BOTTOM_PADDING = 52;
const DESKTOP_BOARD_FRAME_HORIZONTAL_PADDING = 78;
const MOBILE_BOARD_FRAME_HORIZONTAL_PADDING = 50;
const DESKTOP_BOARD_FRAME_VERTICAL_PADDING = 38;
const MOBILE_BOARD_FRAME_VERTICAL_PADDING = 26;
const CLICK_PATTERN = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, -1],
  [1, -2],
];
const ACM_PATTERN = [
  "0111000011110010001",
  "1000100100000011011",
  "1111100100000010101",
  "1000100100000010001",
  "1000100011110010001",
];

const cvSections = [
  {
    title: "Education",
    entries: [
      {
        heading: "Carnegie Mellon University",
        meta: "Pittsburgh, PA",
        subheading: "Degree, major, concentration, or honors placeholder",
        detail:
          "Relevant coursework, thesis, certifications, GPA, or academic notes placeholder.",
      },
      {
        heading: "Lexington High School",
        meta: "Lexington, MA",
        subheading: "Degree, major, concentration, or honors placeholder",
        detail:
          "Relevant coursework, thesis, certifications, GPA, or academic notes placeholder.",
      },
    ],
  },
  {
    title: "Skills",
    entries: [
      {
        heading: "Technical Tools",
        subheading:
          "Tool placeholder, tool placeholder, tool placeholder, tool placeholder",
        detail:
          "Languages placeholder, frameworks placeholder, platforms placeholder.",
      },
      {
        heading: "Additional Skills",
        subheading:
          "Communication placeholder, research placeholder, writing placeholder",
      },
    ],
  },
  {
    title: "Experience",
    entries: [
      {
        heading: "Role Title Placeholder",
        meta: "City, State",
        subheading: "Company or Organization Placeholder",
        detail: "Month Year - Present",
        bullets: [
          "Responsibility or impact statement placeholder.",
          "Technical contribution, research contribution, or leadership detail placeholder.",
          "Result, metric, or collaboration detail placeholder.",
        ],
      },
      {
        heading: "Second Role Placeholder",
        meta: "City, State",
        subheading: "Company or Organization Placeholder",
        detail: "Month Year - Month Year",
        bullets: [
          "Responsibility or impact statement placeholder.",
          "Teamwork, execution, or ownership detail placeholder.",
        ],
      },
    ],
  },
  {
    title: "Projects",
    entries: [
      {
        heading: "Project Title Placeholder",
        meta: "Season Year",
        bullets: [
          "One-line project description placeholder.",
          "Tech stack, model, or implementation detail placeholder.",
        ],
      },
      {
        heading: "Second Project Placeholder",
        meta: "Season Year",
        bullets: [
          "One-line project description placeholder.",
          "Outcome, audience, or scope detail placeholder.",
        ],
      },
    ],
  },
  {
    title: "Programs",
    entries: [
      {
        heading: "Program Name Placeholder",
        meta: "Month Year",
        subheading: "Host, city, or organization placeholder",
      },
      {
        heading: "Program Name Placeholder",
        meta: "Month Year",
        subheading: "Host, city, or organization placeholder",
      },
    ],
  },
  {
    title: "Awards",
    entries: [
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
    ],
  },
];

const projectTiles = [
  {
    title: "Project One",
    description:
      "Add a short overview of what this project does, who it serves, and why it matters.",
  },
  {
    title: "Project Two",
    description:
      "Use this card for another build, experiment, app, website, or creative technical project.",
  },
  {
    title: "Project Three",
    description:
      "Summarize the main idea, your role, and one standout implementation detail here.",
  },
  {
    title: "Project Four",
    description:
      "Good place for a portfolio item with a clear problem, process, and outcome.",
  },
];

const githubActivityLevels = [
  0, 1, 2, 3, 1, 0, 2, 3, 2, 1, 0, 1, 2, 3, 0, 1, 2, 2, 3, 1, 0, 1, 2, 3, 1,
  0, 1, 2, 3, 2, 1, 0, 1, 3, 2, 1, 0, 2, 3, 1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 2,
  1, 0, 1, 2, 3, 1, 0, 2, 3, 2,
];

const contactItems = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourname",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3ZM20.44 12.94c0-3.47-1.85-5.08-4.33-5.08-2 0-2.9 1.1-3.4 1.87V8.5H9.33V20h3.38v-6.4c0-1.69.32-3.31 2.41-3.31 2.06 0 2.09 1.93 2.09 3.42V20h3.38v-7.06Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/yourusername",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.17c-3.21.7-3.89-1.36-3.89-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.19 1.18a10.96 10.96 0 0 1 5.8 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.73.81 1.17 1.83 1.17 3.09 0 4.42-2.69 5.39-5.26 5.67.41.36.77 1.06.77 2.14v3.17c0 .31.2.68.8.56A11.5 11.5 0 0 0 12 .5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const pages = {
  home: {
    key: "home",
    label: "Home",
  },
  about: {
    key: "about",
    label: "About Me",
    eyebrow: "About Me",
    title: "Tell people who you are.",
    body:
      "Use this page for your introduction, background, interests, and the kind of work or ideas you care about most.",
    accent:
      "A short personal statement, a headshot, or a few favorite facts would fit nicely here.",
  },
  cv: {
    key: "cv",
    label: "CV",
    eyebrow: "CV",
    title: "Highlight your experience clearly.",
    body:
      "This page is a good place for your education, roles, awards, skills, and a link to a downloadable resume.",
    accent:
      "You can also break it into sections like Experience, Education, Skills, and Publications later on.",
  },
  projects: {
    key: "projects",
    label: "Projects",
    eyebrow: "Projects",
    title: "Show what you have built.",
    body:
      "Feature selected projects, case studies, experiments, or anything you want visitors to explore in more detail.",
    accent:
      "Each project can eventually become its own card, image block, or linked detail page.",
  },
  contact: {
    key: "contact",
    label: "Contact Me",
    eyebrow: "Contact Me",
    title: "Make it easy for people to reach you.",
    body:
      "Add your email, social links, booking link, or a small contact form so visitors know the best way to connect.",
    accent:
      "This page works well with a simple call to action and just one or two clear contact options.",
  },
};

const navItems = [
  { label: "About Me", hash: "#about", page: "about" },
  { label: "CV", hash: "#cv", page: "cv" },
  { label: "Projects", hash: "#projects", page: "projects" },
  { label: "Contact Me", hash: "#contact", page: "contact" },
];

function createEmptyGrid(columns, rows) {
  return Array.from({ length: columns * rows }, () => 0);
}

function createAcmGrid(columns, rows) {
  const grid = createEmptyGrid(columns, rows);
  const patternRows = ACM_PATTERN.length;
  const patternColumns = ACM_PATTERN[0]?.length ?? 0;
  const startRow = Math.max(0, Math.floor((rows - patternRows) / 2));
  const startColumn = Math.max(0, Math.floor((columns - patternColumns) / 2));

  ACM_PATTERN.forEach((patternRow, rowIndex) => {
    patternRow.split("").forEach((cell, columnIndex) => {
      if (cell !== "1") {
        return;
      }

      const row = startRow + rowIndex;
      const column = startColumn + columnIndex;

      if (column >= columns || row >= rows) {
        return;
      }

      grid[row * columns + column] = 1;
    });
  });

  return grid.some(Boolean)
    ? grid
    : seedPattern(grid, columns, rows, Math.floor(columns / 2), Math.floor(rows / 2));
}

function createRandomReseedGrid(columns, rows) {
  const grid = createEmptyGrid(columns, rows);
  const seedCount = 20 + Math.floor(Math.random() * 11);
  const centerColumn = Math.floor(columns / 2);
  const centerRow = Math.floor(rows / 2);

  for (let index = 0; index < seedCount; index += 1) {
    const columnOffset = Math.floor(Math.random() * 7) - 3;
    const rowOffset = Math.floor(Math.random() * 7) - 3;
    const column = Math.min(columns - 1, Math.max(0, centerColumn + columnOffset));
    const row = Math.min(rows - 1, Math.max(0, centerRow + rowOffset));

    grid[row * columns + column] = 1;
  }

  return grid.some(Boolean)
    ? grid
    : seedPattern(grid, columns, rows, centerColumn, centerRow);
}

function getGridMetrics() {
  if (typeof window === "undefined") {
    return { columns: 0, rows: 0, dotSize: getHomepageDotBaseSize() * 1.5, gap: 9 };
  }

  const compactLayout = window.innerWidth <= 720;
  const dotSize = getHomepageDotBaseSize() * 1.5;
  const gap = compactLayout ? 8 : 9;
  const pitch = dotSize + gap;
  const contentPadding = compactLayout
    ? MOBILE_CONTENT_PADDING
    : DESKTOP_CONTENT_PADDING;
  const topbarHeight = compactLayout
    ? MOBILE_TOPBAR_HEIGHT
    : DESKTOP_TOPBAR_HEIGHT;
  const lifeHorizontalPadding = compactLayout
    ? MOBILE_LIFE_HORIZONTAL_PADDING
    : DESKTOP_LIFE_HORIZONTAL_PADDING;
  const lifeTopPadding = compactLayout
    ? MOBILE_LIFE_TOP_PADDING
    : DESKTOP_LIFE_TOP_PADDING;
  const lifeBottomPadding = compactLayout
    ? MOBILE_LIFE_BOTTOM_PADDING
    : DESKTOP_LIFE_BOTTOM_PADDING;
  const boardFrameHorizontalPadding = compactLayout
    ? MOBILE_BOARD_FRAME_HORIZONTAL_PADDING
    : DESKTOP_BOARD_FRAME_HORIZONTAL_PADDING;
  const boardFrameVerticalPadding = compactLayout
    ? MOBILE_BOARD_FRAME_VERTICAL_PADDING
    : DESKTOP_BOARD_FRAME_VERTICAL_PADDING;
  const contentWidth = Math.min(1120, window.innerWidth - contentPadding);
  const availableWidth = Math.max(
    pitch * 10,
    contentWidth -
      lifeHorizontalPadding -
      boardFrameHorizontalPadding -
      pitch * 2,
  );
  const availableHeight = Math.max(
    pitch * 14,
    window.innerHeight -
      topbarHeight -
      lifeTopPadding -
      lifeBottomPadding -
      boardFrameVerticalPadding -
      pitch * 2,
  );

  return {
    columns: Math.max(10, Math.floor(availableWidth / pitch) + 2),
    rows: Math.max(14, Math.floor(availableHeight / pitch)),
    dotSize,
    gap,
  };
}

function countNeighbors(grid, columns, rows, column, row) {
  let neighbors = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      const nextColumn = column + columnOffset;
      const nextRow = row + rowOffset;

      if (
        nextColumn < 0 ||
        nextColumn >= columns ||
        nextRow < 0 ||
        nextRow >= rows
      ) {
        continue;
      }

      neighbors += grid[nextRow * columns + nextColumn] > 0 ? 1 : 0;
    }
  }

  return neighbors;
}

function advanceGrid(grid, columns, rows) {
  const nextGrid = createEmptyGrid(columns, rows);
  const explodingCells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const currentAge = grid[index];
      const isAlive = currentAge > 0;
      const neighbors = countNeighbors(grid, columns, rows, column, row);
      const survives = isAlive && (neighbors === 2 || neighbors === 3);
      const isBorn = !isAlive && neighbors === 3;
      const nextAge = survives ? currentAge + 1 : isBorn ? 1 : 0;
      const diesOfOldAge = nextAge > MAX_CELL_AGE;
      const nextValue = diesOfOldAge ? 0 : nextAge;

      nextGrid[index] = nextValue;

      if (diesOfOldAge) {
        explodingCells.push([column, row]);
      }
    }
  }

  explodingCells.forEach(([column, row]) => {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        if (rowOffset === 0 && columnOffset === 0) {
          continue;
        }

        const nextColumn = column + columnOffset;
        const nextRow = row + rowOffset;

        if (
          nextColumn < 0 ||
          nextColumn >= columns ||
          nextRow < 0 ||
          nextRow >= rows
        ) {
          continue;
        }

        const neighborIndex = nextRow * columns + nextColumn;

        if (
          nextGrid[neighborIndex] === 0 &&
          Math.random() < EXPLOSION_INFECTION_PROBABILITY
        ) {
          nextGrid[neighborIndex] = 1;
        }
      }
    }
  });

  const activeCount = nextGrid.reduce(
    (count, value) => count + (value > 0 ? 1 : 0),
    0,
  );

  return { nextGrid, activeCount };
}

function seedPattern(grid, columns, rows, centerColumn, centerRow) {
  const nextGrid = [...grid];

  CLICK_PATTERN.forEach(([columnOffset, rowOffset]) => {
    const column = centerColumn + columnOffset;
    const row = centerRow + rowOffset;

    if (column < 0 || column >= columns || row < 0 || row >= rows) {
      return;
    }

    nextGrid[row * columns + column] = 1;
  });

  return nextGrid;
}

function toSectionId(title) {
  return title.toLowerCase().replaceAll(" ", "-");
}

function getPageFromHash(hash) {
  const normalizedHash = hash.replace("#", "");

  if (normalizedHash in pages) {
    return normalizedHash;
  }

  return "home";
}

function getHomepageDotBaseSize() {
  if (typeof window === "undefined") {
    return 18;
  }

  return window.innerWidth <= 720 ? 15 : 18;
}

function pushSquare(tiles, x, y, size) {
  if (size <= 0) {
    return;
  }

  tiles.push({ x, y, size });
}

function tileRectangle(tiles, x, y, width, height, reverse = false) {
  if (width <= 0 || height <= 0) {
    return;
  }

  if (width === height) {
    if (width <= 2) {
      pushSquare(tiles, x, y, width);
      return;
    }

    const split = Math.ceil(width / 2);
    const remainder = width - split;

    pushSquare(tiles, x, y, split);
    if (remainder > 0) {
      pushSquare(tiles, x + split, y + split, remainder);
      tileRectangle(tiles, x + split, y, remainder, split, !reverse);
      tileRectangle(tiles, x, y + split, split, remainder, reverse);
    }
    return;
  }

  if (width > height) {
    const count = Math.floor(width / height);

    for (let index = 0; index < count; index += 1) {
      const offset = reverse ? width - height * (index + 1) : height * index;
      pushSquare(tiles, x + offset, y, height);
    }

    tileRectangle(
      tiles,
      x + (reverse ? 0 : count * height),
      y,
      width - count * height,
      height,
      !reverse,
    );
    return;
  }

  const count = Math.floor(height / width);

  for (let index = 0; index < count; index += 1) {
    const offset = reverse ? height - width * (index + 1) : width * index;
    pushSquare(tiles, x, y + offset, width);
  }

  tileRectangle(
    tiles,
    x,
    y + (reverse ? 0 : count * width),
    width,
    height - count * width,
    !reverse,
  );
}

function createAboutTiles(n) {
  const cellCount = Math.max(0, n - 1);
  const tiles = [];

  if (cellCount > 0) {
    tileRectangle(tiles, 0, 0, cellCount, cellCount);
  }

  return tiles;
}

function colorAboutTiles(tiles) {
  return tiles
    .map((tile) => ({
      ...tile,
      colorIndex: Math.floor(Math.random() * ABOUT_TILE_PALETTE.length),
    }))
    .sort((firstTile, secondTile) => secondTile.size - firstTile.size);
}

function greatestCommonDivisor(firstValue, secondValue) {
  let left = Math.abs(firstValue);
  let right = Math.abs(secondValue);

  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left;
}

function getCoprimeStep(n, preferredStep) {
  let step = Math.min(n - 1, Math.max(1, preferredStep));

  while (step > 1) {
    if (greatestCommonDivisor(step, n) === 1) {
      return step;
    }

    step -= 1;
  }

  return 1;
}

function createEvenPinwheelHoles(n) {
  const half = n / 2;

  return Array.from({ length: n }, (_, row) =>
    row < half ? row * 2 + 1 : (row - half) * 2,
  );
}

function getPinwheelTileKey(row, column, n) {
  const centerSize = Math.max(2, Math.round(n / 3));
  const centerStart = Math.floor((n - centerSize) / 2);
  const centerEnd = centerStart + centerSize - 1;

  if (row < centerStart) {
    return column < centerStart ? "left" : "top";
  }

  if (column > centerEnd) {
    return row > centerEnd ? "bottom" : "right";
  }

  if (row > centerEnd) {
    return column > centerEnd ? "right" : "bottom";
  }

  if (column < centerStart) {
    return "left";
  }

  return "center";
}

function getTileColorFromKey(tileKey) {
  if (tileKey === null) {
    return null;
  }

  let hash = 17;

  for (let index = 0; index < tileKey.length; index += 1) {
    hash = (hash * 33 + tileKey.charCodeAt(index)) % 104729;
  }

  return hash;
}

function createOddHoles(n) {
  const step = getCoprimeStep(n, Math.floor(n / 3));
  const offset = Math.max(0, Math.floor(n / 3) - 1);

  return Array.from({ length: n }, (_, row) => (row * step + offset) % n);
}

function getTileKey(row, column, n) {
  if (n % 2 === 0) {
    const holes = createEvenPinwheelHoles(n);

    if (holes[row] === column) {
      return null;
    }

    return getPinwheelTileKey(row, column, n);
  }

  const holes = createOddHoles(n);

  if (holes[row] === column) {
    return null;
  }

  return getOddTileKey(row, column, n);
}

function createTileColorMap(n) {
  const adjacency = new Map();

  const ensureTile = (tileKey) => {
    if (tileKey !== null && !adjacency.has(tileKey)) {
      adjacency.set(tileKey, new Set());
    }
  };

  for (let row = 0; row < n; row += 1) {
    for (let column = 0; column < n; column += 1) {
      const tileKey = getTileKey(row, column, n);
      ensureTile(tileKey);

      const neighbors = [
        [row + 1, column],
        [row, column + 1],
      ];

      neighbors.forEach(([nextRow, nextColumn]) => {
        if (nextRow >= n || nextColumn >= n) {
          return;
        }

        const neighborKey = getTileKey(nextRow, nextColumn, n);
        ensureTile(neighborKey);

        if (
          tileKey === null ||
          neighborKey === null ||
          tileKey === neighborKey
        ) {
          return;
        }

        adjacency.get(tileKey)?.add(neighborKey);
        adjacency.get(neighborKey)?.add(tileKey);
      });
    }
  }

  const orderedTiles = [...adjacency.keys()].sort((firstKey, secondKey) => {
    const degreeDifference =
      (adjacency.get(secondKey)?.size ?? 0) - (adjacency.get(firstKey)?.size ?? 0);

    if (degreeDifference !== 0) {
      return degreeDifference;
    }

    return getTileColorFromKey(firstKey) - getTileColorFromKey(secondKey);
  });

  const colorMap = new Map();

  orderedTiles.forEach((tileKey) => {
    const usedColors = new Set(
      [...(adjacency.get(tileKey) ?? [])]
        .map((neighborKey) => colorMap.get(neighborKey))
        .filter((colorIndex) => colorIndex !== undefined),
    );

    const preferredOffset = getTileColorFromKey(tileKey) % ABOUT_TILE_PALETTE.length;

    for (let attempt = 0; attempt < ABOUT_TILE_PALETTE.length; attempt += 1) {
      const colorIndex = (preferredOffset + attempt) % ABOUT_TILE_PALETTE.length;

      if (!usedColors.has(colorIndex)) {
        colorMap.set(tileKey, colorIndex);
        return;
      }
    }

    colorMap.set(tileKey, preferredOffset);
  });

  return colorMap;
}

function getOddTileKey(row, column, n) {
  const blockRow = Math.min(2, Math.floor((row * 3) / n));
  const blockColumn = Math.min(2, Math.floor((column * 3) / n));

  return `odd-${blockRow}-${blockColumn}`;
}

function getDotFill(row, column, n, colorMap) {
  const tileKey = getTileKey(row, column, n);
  if (tileKey === null) {
    return null;
  }

  return ABOUT_TILE_PALETTE[colorMap.get(tileKey) ?? 0];
}

function AboutGraphAnimation() {
  const [animationState, setAnimationState] = useState({
    n: ABOUT_START_N,
    direction: -1,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [homepageDotSize, setHomepageDotSize] = useState(() =>
    getHomepageDotBaseSize(),
  );
  const { n } = animationState;

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setAnimationState((currentState) => {
        let nextDirection = currentState.direction;
        let nextN = currentState.n + currentState.direction;

        if (nextN < ABOUT_MIN_N) {
          nextDirection = 1;
          nextN = ABOUT_MIN_N + 1;
        } else if (nextN > ABOUT_MAX_N) {
          nextDirection = -1;
          nextN = ABOUT_MAX_N - 1;
        }

        return {
          n: nextN,
          direction: nextDirection,
        };
      });
    }, ABOUT_STEP_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  useEffect(() => {
    const handleResize = () => {
      setHomepageDotSize(getHomepageDotBaseSize());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const aboutPattern = useMemo(() => {
    const boardUnits = ABOUT_BASE_N - 1;
    const colorMap = createTileColorMap(n);
    const dotDiameter =
      n > 1 ? homepageDotSize * (boardUnits / (n - 1)) : homepageDotSize * boardUnits;
    const dotRadius = dotDiameter / 2;
    const boardSize = homepageDotSize + boardUnits * (homepageDotSize + 9);
    const viewBoxSize = boardSize + dotDiameter + 32;
    const boardOrigin = (viewBoxSize - boardSize) / 2;
    const step = n > 1 ? boardSize / (n - 1) : 0;
    const dots = Array.from({ length: n * n }, (_, index) => {
      const row = Math.floor(index / n);
      const column = index % n;

      return {
        cx: n > 1 ? boardOrigin + column * step : viewBoxSize / 2,
        cy: n > 1 ? boardOrigin + row * step : viewBoxSize / 2,
        fill: getDotFill(row, column, n, colorMap),
      };
    });

    return {
      dots,
      dotRadius,
      boardOrigin,
      viewBoxSize,
    };
  }, [homepageDotSize, n]);

  return (
    <div
      className="about-animation-placeholder"
      aria-hidden="true"
      onClick={() => setIsPaused((current) => !current)}
    >
      <svg
        className="about-graph-animation"
        viewBox={`0 0 ${aboutPattern.viewBoxSize} ${aboutPattern.viewBoxSize}`}
        role="img"
      >
        {aboutPattern.dots.map((dot) => (
          <circle
            key={`${dot.cx}-${dot.cy}`}
            cx={dot.cx}
            cy={dot.cy}
            r={aboutPattern.dotRadius}
            fill={dot.fill ?? "rgba(120, 126, 120, 0.22)"}
            fillOpacity={dot.fill === null ? 1 : 0.72}
          />
        ))}
      </svg>

      <div className="about-info-hover">
        <div className="about-animation-caption" tabIndex={0}>
          <span>IMO P6 (2025)</span>
          <strong>n = {n}</strong>
        </div>
        <div className="about-info-panel" role="note" aria-label="About this animation">
          <p>Based on IMO 2025 Problem 6, this animation shows how a square grid can be tiled as n changes while leaving exactly one uncovered unit square in every row and every column. The colored blocks show the larger tiles, and the shifting pattern highlights how the construction reorganizes itself for different boards.</p>
        </div>
      </div>
    </div>
  );
}

function DotField() {
  const [metrics, setMetrics] = useState(() => getGridMetrics());
  const { columns, rows, dotSize, gap } = metrics;
  const [grid, setGrid] = useState(() => createAcmGrid(columns, rows));
  const [hasStarted, setHasStarted] = useState(false);
  const activeCountRef = useRef(
    grid.reduce((count, value) => count + (value > 0 ? 1 : 0), 0),
  );
  const previousMetricsRef = useRef(metrics);
  const reseedTimeoutRef = useRef(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasStarted(true);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMetrics(getGridMetrics());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setGrid((currentGrid) => {
      const resizedGrid = createEmptyGrid(columns, rows);
      const previousMetrics = previousMetricsRef.current;

      if (currentGrid.length === 0) {
        const acmGrid = createAcmGrid(columns, rows);
        activeCountRef.current = acmGrid.reduce(
          (count, value) => count + (value > 0 ? 1 : 0),
          0,
        );
        previousMetricsRef.current = metrics;
        return acmGrid;
      }

      const previousColumns = previousMetrics.columns;
      const previousRows = previousMetrics.rows;
      const copyColumns = Math.min(columns, previousColumns);
      const copyRows = Math.min(rows, previousRows);

      let nextActiveCount = 0;

      for (let row = 0; row < copyRows; row += 1) {
        for (let column = 0; column < copyColumns; column += 1) {
          const previousIndex = row * previousColumns + column;
          const nextIndex = row * columns + column;
          const value = currentGrid[previousIndex] ?? 0;

          resizedGrid[nextIndex] = value;
          nextActiveCount += value > 0 ? 1 : 0;
        }
      }

      activeCountRef.current = nextActiveCount;
      previousMetricsRef.current = metrics;
      return resizedGrid;
    });
  }, [columns, metrics, rows]);

  useEffect(() => {
    if (columns === 0 || rows === 0 || !hasStarted) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (activeCountRef.current === 0) {
        if (reseedTimeoutRef.current !== null) {
          return;
        }

        reseedTimeoutRef.current = window.setTimeout(() => {
          setGrid(() => {
            const reseededGrid = createRandomReseedGrid(columns, rows);
            activeCountRef.current = reseededGrid.reduce(
              (count, value) => count + (value > 0 ? 1 : 0),
              0,
            );
            reseedTimeoutRef.current = null;
            return reseededGrid;
          });
        }, RESEED_DELAY_MS);
        return;
      }

      setGrid((currentGrid) => {
        const { nextGrid, activeCount } = advanceGrid(currentGrid, columns, rows);
        activeCountRef.current = activeCount;
        return nextGrid;
      });
    }, ABOUT_STEP_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (reseedTimeoutRef.current !== null) {
        window.clearTimeout(reseedTimeoutRef.current);
        reseedTimeoutRef.current = null;
      }
    };
  }, [columns, hasStarted, rows]);

  const cells = useMemo(
    () =>
      Array.from({ length: columns * rows }, (_, index) => {
        const age = grid[index];
        const isAlive = age > 0;
        const colorIndex = isAlive
          ? (Math.floor((age - 1) / 2) % AGE_COLOR_CYCLE.length)
          : 0;
        const cycleDepth = Math.min(
          colorIndex,
          AGE_COLOR_CYCLE.length - 1 - colorIndex,
        );
        const cellColor = AGE_COLOR_CYCLE[colorIndex];
        const glowAlpha = Math.min(0.3, 0.14 + cycleDepth * 0.05);

        return (
          <button
            key={index}
            type="button"
            className={`dot ${isAlive ? "is-alive" : ""}`}
            aria-label={isAlive ? "Active cell" : "Inactive cell"}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              ...(isAlive
                ? {
                    backgroundColor: cellColor,
                    opacity: 0.72,
                    boxShadow: `0 0 0 1px rgba(158, 179, 194, 0.32), 0 0 16px rgba(27, 59, 111, ${glowAlpha})`,
                  }
                : undefined),
            }}
            onClick={() => {
              const row = Math.floor(index / columns);
              const column = index % columns;

              setGrid((currentGrid) => {
                const nextGrid = seedPattern(
                  currentGrid,
                  columns,
                  rows,
                  column,
                  row,
                );

                activeCountRef.current = nextGrid.reduce(
                  (count, value) => count + (value > 0 ? 1 : 0),
                  0,
                );

                return nextGrid;
              });
            }}
          />
        );
      }),
    [columns, dotSize, grid, rows],
  );
  const infectedCount = useMemo(
    () => grid.reduce((count, value) => count + (value > 0 ? 1 : 0), 0),
    [grid],
  );
  const lifeDescription =
    "Inspired by Conway's Game of Life, this board gives each cell a full life cycle: new infections begin pale, deepen through darker blues, then fade back toward their starting shade before dying. When a cell dies, it bursts into its eight neighboring positions, each with an 0.8 chance of becoming infected. You can also click any point on the board to introduce fresh activity. The simulation advances in 0.8s steps, and when the board fully burns out, a small random cluster of 20 to 28 cells start the process again.";

  return (
    <div className="life-page">
      <div className="life-board">
        <div className="life-info-hover life-info-hover-caption">
          <div className="life-caption" aria-label={`Currently infected cells: ${infectedCount}`}>
            <span>(Not) Conway</span>
            <strong>n = {infectedCount}</strong>
          </div>
          <div className="life-info-panel" role="note" aria-label="About this graphic">
            <p>{lifeDescription}</p>
          </div>
        </div>

        <div
          className="dot-grid"
          style={{
            gap: `${gap}px`,
            gridTemplateColumns: `repeat(${columns}, ${dotSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
          }}
        >
          {cells}
        </div>
      </div>

      <footer className="life-footer">
        <div className="life-info-hover">
          <p className="life-instruction" tabIndex={0}>
            Click anywhere on the board to introduce new active cells.
          </p>
          <div className="life-info-panel" role="note" aria-label="About this graphic">
            <p>{lifeDescription}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CvPage() {
  const [activeSectionTitle, setActiveSectionTitle] = useState(cvSections[0].title);
  const activeSection =
    cvSections.find((section) => section.title === activeSectionTitle) ?? cvSections[0];

  return (
    <>
      <section className="cv-banner-placeholder" aria-label="Animation placeholder">
        <span>Animation Banner</span>
      </section>

      <section className="cv-layout" aria-label="Curriculum vitae">
        <aside className="cv-sidebar">
          <div className="cv-sidebar-inner">
            <p className="section-eyebrow">Jump To</p>
            <nav className="cv-side-nav" aria-label="CV section navigation">
              {cvSections.map((section) => (
                <button
                  key={section.title}
                  type="button"
                  className={`side-nav-pill ${
                    activeSectionTitle === section.title ? "is-active" : ""
                  }`}
                  onClick={() => setActiveSectionTitle(section.title)}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="cv-content">
          <section
            key={activeSection.title}
            id={toSectionId(activeSection.title)}
            className="cv-section-card"
          >
            <div className="cv-section-header">
              <h2 className="cv-section-title">{activeSection.title}</h2>
              <div className="cv-section-divider" />
            </div>

            <div className="cv-section-body">
              {activeSection.entries.map((entry) => (
                <article
                  key={`${activeSection.title}-${entry.heading}-${entry.meta ?? ""}`}
                  className="cv-entry"
                >
                  <div className="cv-entry-top">
                    <h3>{entry.heading}</h3>
                    {entry.meta ? <p className="cv-meta">{entry.meta}</p> : null}
                  </div>

                  {entry.subheading ? (
                    <p className="cv-subheading">{entry.subheading}</p>
                  ) : null}

                  {entry.detail ? <p className="cv-detail">{entry.detail}</p> : null}

                  {entry.bullets ? (
                    <ul className="cv-bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function ProjectsPage() {
  return (
    <>
      <section className="projects-feature-row" aria-label="Projects highlights">
        <div
          className="projects-animation-placeholder"
          aria-label="Animation placeholder"
        />

        <article
          className="project-tile github-plugin-card project-tile-card"
          aria-label="GitHub activity plugin"
        >
          <div className="github-stats-grid">
            <article className="github-stat-card">
              <span>Commits</span>
              <strong>148</strong>
            </article>
            <article className="github-stat-card">
              <span>Pull Requests</span>
              <strong>19</strong>
            </article>
          </div>

          <div className="github-heatmap" aria-label="GitHub activity">
            {githubActivityLevels.map((level, index) => (
              <span
                key={`${level}-${index}`}
                className={`github-cell github-cell-level-${level}`}
              />
            ))}
          </div>

          <div className="github-labels" aria-label="GitHub labels">
            {["JavaScript", "React", "CSS", "UI/UX"].map((label) => (
              <span key={label} className="github-label-pill">
                {label}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="projects-tile-grid" aria-label="Project tiles">
        {projectTiles.map((project) => (
          <article key={project.title} className="project-tile-card">
            <div className="project-image-placeholder" aria-hidden="true">
              <span>Image</span>
            </div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <section className="about-layout" aria-label="About me">
      <div className="about-animation-column">
        <AboutGraphAnimation />
        <p className="about-animation-instruction">
          Click to pause/unpause the board.
        </p>
      </div>

      <article className="about-copy-card">
        <img className="about-photo" src="/headshot.jpg" alt="headshot" />

        <div className="about-placeholder-copy">
          <p>
            Hey! I&apos;m{" "}
            <span className="about-name-hover">
              <span className="about-highlight-name" tabIndex={0}>
                Amy
              </span>
              <span className="about-inline-panel" role="note" aria-label="About Amy">
                Fun fact: my name&apos;s a palindrome!
              </span>
            </span>
            , a junior at Carnegie Mellon studying Computer Science.
          </p>
          <p>
            Right now, I&apos;m building a genomic language model at{" "}
            <a
              className="about-inline-link"
              href="https://labs.bio.cmu.edu/kaplow/people/"
              target="_blank"
              rel="noreferrer"
            >
              Kaplow Lab
            </a>
            . This summer, I&apos;ll be working with LLMs in production at Amazon
            as a SDE Intern.
          </p>
          <p>
            I love solving puzzles, and a few of my favorites are woven into this
            site. Check out my projects to see what else I&apos;ve been working on!
          </p>
        </div>
      </article>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="contact-layout" aria-label="Contact me">
      <div className="contact-animation-placeholder" aria-label="Animation placeholder" />

      <div className="contact-content-column">
        <p className="contact-email-line">email [at] gmail.com</p>

        <div className="contact-button-row">
          {contactItems.map((item) => (
            <a
              key={item.label}
              className="contact-link-button"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromHash(window.location.hash),
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = currentPage === "home" ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [currentPage]);

  const page = pages[currentPage];

  return (
    <div className={`site-shell ${currentPage === "home" ? "site-shell-home" : ""}`}>
      <header className="topbar">
        <a
          className={`brand ${currentPage === "home" ? "is-active" : ""}`}
          href="#home"
          aria-label="Homepage"
        >
          AMY MA
        </a>

        <nav className="nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.page}
              className={`nav-link ${currentPage === item.page ? "is-active" : ""}`}
              href={item.hash}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className={`content ${currentPage === "home" ? "content-home" : ""}`}>
        {currentPage === "about" ? (
          <AboutPage />
        ) : currentPage === "cv" ? (
          <CvPage />
        ) : currentPage === "projects" ? (
          <ProjectsPage />
        ) : currentPage === "contact" ? (
          <ContactPage />
        ) : (
          <DotField />
        )}
      </main>
    </div>
  );
}

export default App;
