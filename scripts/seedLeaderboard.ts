import "dotenv/config";
import postgres from "postgres";

const MIN_SCORE = 300;
const ENTRIES_PER_DIFFICULTY = 100;
const SCORE_STEP = 5;
const HIGH_SCORE_ROWS_PER_DIFFICULTY = 5;
const SKEW_EXPONENT = 2.7;

type Difficulty = "normal" | "hard" | "puzzle" | "diabolical";

interface ScoreRange {
  min: number;
  max: number;
}

const SCORE_RANGES: Record<Difficulty, ScoreRange> = {
  normal: { min: 300, max: 500 },
  hard: { min: 300, max: 450 },
  puzzle: { min: 300, max: 475 },
  diabolical: { min: 300, max: 425 },
};

const DIFFICULTIES = Object.keys(SCORE_RANGES) as Difficulty[];

interface SeedRow {
  player_name: string;
  score: number;
  difficulty: Difficulty;
  created_at: Date;
}

const DIFFICULTY_NAME_PARTS: Record<
  Difficulty,
  { first: string[]; second: string[] }
> = {
  normal: {
    first: [
      "Pixel",
      "Neon",
      "Turbo",
      "Retro",
      "Coin",
      "Laser",
      "Snack",
      "Jelly",
      "Comet",
      "Lucky",
    ],
    second: [
      "Pilot",
      "Wizard",
      "Ninja",
      "Racer",
      "Goblin",
      "Captain",
      "Otter",
      "Bandit",
      "Chaser",
      "Jumper",
    ],
  },
  hard: {
    first: [
      "Clutch",
      "Frag",
      "Combo",
      "Ranked",
      "Arena",
      "Speed",
      "Meta",
      "Quest",
      "Boss",
      "Sweaty",
    ],
    second: [
      "Sweeper",
      "Hunter",
      "Sharpshot",
      "Striker",
      "Runner",
      "Breaker",
      "Smurfer",
      "Raider",
      "Pusher",
      "Sniper",
    ],
  },
  puzzle: {
    first: [
      "Quantum",
      "Vector",
      "Logic",
      "Cipher",
      "Orbit",
      "Nova",
      "Cosmo",
      "Binary",
      "Signal",
      "Zen",
    ],
    second: [
      "Solver",
      "Mapper",
      "Nomad",
      "Seeker",
      "Thinker",
      "Monk",
      "Oracle",
      "Drifter",
      "Weaver",
      "Tinkerer",
    ],
  },
  diabolical: {
    first: [
      "Chaos",
      "Gremlin",
      "Panic",
      "Wildcard",
      "Oops",
      "Mayhem",
      "Doom",
      "Frenzy",
      "Nightmare",
      "Spicy",
    ],
    second: [
      "Magnet",
      "Engine",
      "Ferret",
      "Goblin",
      "Sprinter",
      "Tornado",
      "Banana",
      "Phantom",
      "Rocket",
      "Jester",
    ],
  },
};

function toSeedSafeName(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
}

function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomScoreInStepRange(min: number, max: number): number {
  if (min % SCORE_STEP !== 0 || max % SCORE_STEP !== 0) {
    throw new Error(`Range [${min}, ${max}] must align to step ${SCORE_STEP}`);
  }

  const steps = Math.floor((max - min) / SCORE_STEP);
  const stepOffset = randomIntInclusive(0, steps);
  return min + stepOffset * SCORE_STEP;
}

function randomScoreSkewedTowardMin(min: number, max: number): number {
  if (min % SCORE_STEP !== 0 || max % SCORE_STEP !== 0) {
    throw new Error(`Range [${min}, ${max}] must align to step ${SCORE_STEP}`);
  }

  const steps = Math.floor((max - min) / SCORE_STEP);
  const skewed = Math.pow(Math.random(), SKEW_EXPONENT);
  const stepOffset = Math.floor(skewed * (steps + 1));
  return min + Math.min(stepOffset, steps) * SCORE_STEP;
}

function generatePlayerName(difficulty: Difficulty, rank: number): string {
  const nameParts = DIFFICULTY_NAME_PARTS[difficulty];
  const first = nameParts.first[rank % nameParts.first.length];
  const second =
    nameParts.second[
      Math.floor(rank / nameParts.first.length) % nameParts.second.length
    ];
  return toSeedSafeName(`${first} ${second}`);
}

function buildRowsForDifficulty(difficulty: Difficulty): SeedRow[] {
  const range = SCORE_RANGES[difficulty];
  const rows: SeedRow[] = [];
  const now = Date.now();

  for (let index = 0; index < ENTRIES_PER_DIFFICULTY; index += 1) {
    const score =
      index < HIGH_SCORE_ROWS_PER_DIFFICULTY
        ? randomScoreInStepRange(Math.max(range.min, range.max - 20), range.max)
        : randomScoreSkewedTowardMin(range.min, range.max);
    const createdAt = new Date(now - index * 60_000);

    if (
      score < MIN_SCORE ||
      score < range.min ||
      score > range.max ||
      score % SCORE_STEP !== 0
    ) {
      throw new Error(
        `Invalid seed score generated for ${difficulty}: ${score} not in [${range.min}, ${range.max}]`,
      );
    }

    rows.push({
      player_name: generatePlayerName(difficulty, index),
      score,
      difficulty,
      created_at: createdAt,
    });
  }

  return rows;
}

function validateSummary(summary: SummaryRow[]) {
  if (summary.length !== DIFFICULTIES.length) {
    throw new Error(
      `Expected ${DIFFICULTIES.length} difficulty groups, received ${summary.length}`,
    );
  }

  for (const difficulty of DIFFICULTIES) {
    const row = summary.find((item) => item.difficulty === difficulty);
    if (!row) {
      throw new Error(`Missing summary row for ${difficulty}`);
    }

    const range = SCORE_RANGES[difficulty];
    if (row.count !== ENTRIES_PER_DIFFICULTY) {
      throw new Error(
        `Expected ${ENTRIES_PER_DIFFICULTY} rows for ${difficulty}, got ${row.count}`,
      );
    }
    if (row.min_score < MIN_SCORE) {
      throw new Error(
        `${difficulty} min score ${row.min_score} is below leaderboard minimum ${MIN_SCORE}`,
      );
    }
    if (row.min_score < range.min || row.max_score > range.max) {
      throw new Error(
        `${difficulty} score range [${row.min_score}, ${row.max_score}] is outside [${range.min}, ${range.max}]`,
      );
    }
  }
}

interface SummaryRow {
  difficulty: Difficulty;
  count: number;
  min_score: number;
  max_score: number;
}

interface InvalidScoreCountRow {
  invalid_count: number;
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for seeding");
  }

  const sql = postgres(databaseUrl);

  try {
    const seedRows = DIFFICULTIES.flatMap((difficulty) =>
      buildRowsForDifficulty(difficulty),
    );

    console.log(
      `Resetting leaderboard and inserting ${seedRows.length} rows (${ENTRIES_PER_DIFFICULTY} per difficulty)...`,
    );

    await sql`delete from leaderboard_entries`;

    await sql`
      insert into leaderboard_entries ${sql(seedRows, [
        "player_name",
        "score",
        "difficulty",
        "created_at",
      ])}
    `;

    const summary = await sql<SummaryRow[]>`
      select
        difficulty,
        count(*)::int as count,
        min(score)::int as min_score,
        max(score)::int as max_score
      from leaderboard_entries
      group by difficulty
      order by difficulty
    `;

    const invalidScoreCountResult = await sql<InvalidScoreCountRow[]>`
      select count(*)::int as invalid_count
      from leaderboard_entries
      where mod(score, ${SCORE_STEP}) <> 0
    `;
    const invalidScoreCount = invalidScoreCountResult[0]?.invalid_count ?? 0;
    if (invalidScoreCount > 0) {
      throw new Error(
        `Seed inserted ${invalidScoreCount} rows not divisible by ${SCORE_STEP}`,
      );
    }

    validateSummary(summary);

    console.log("Seed complete. Range summary:");
    for (const row of summary) {
      console.log(
        `- ${row.difficulty}: count=${row.count}, min=${row.min_score}, max=${row.max_score}`,
      );
    }
  } finally {
    await sql.end();
  }
}

run().catch((error) => {
  console.error("Leaderboard seed failed:", error);
  process.exit(1);
});
