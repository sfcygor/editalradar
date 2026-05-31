import {
  pgTable,
  text,
  integer,
  real,
  index,
  timestamp,
  boolean,
  jsonb
} from "drizzle-orm/pg-core";

// Helper for generating UUID v4 strings in JS if DB doesn't have it natively
// But better-sqlite3 doesn't have default(sql`gen_random_uuid()`) natively without extensions.
// We'll just use a crypto.randomUUID() in application code or generate it randomly in the model.
// For schema purposes, text("id").primaryKey() is enough.

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  shareCode: text("share_code").notNull().unique(),
  avatarUrl: text("avatar_url"),
  concurso: text("concurso"), // e.g. "PM-SP 2026"
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("gray"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const questions = pgTable(
  "questions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("multiple_choice"),
    text: text("text").notNull(),
    subject: text("subject").notNull(),
    topic: text("topic"),
    difficulty: text("difficulty").notNull().default("Médio"),
    options: jsonb("options")
      .notNull()
      .$type<{ letter: string; text: string }[]>(),
    answer: text("answer").notNull(),
    explanation: text("explanation"),
    source: text("source"),
    isFavorite: boolean("is_favorite").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index("questions_user_id_idx").on(t.userId)]
);

export const questionAttempts = pgTable(
  "question_attempts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    selectedAnswer: text("selected_answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    attemptedAt: timestamp("attempted_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    index("attempts_user_id_idx").on(t.userId),
    index("attempts_question_id_idx").on(t.questionId),
  ]
);

export const flashcardDecks = pgTable(
  "flashcard_decks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    subject: text("subject").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index("decks_user_id_idx").on(t.userId)]
);

export const flashcards = pgTable(
  "flashcards",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    deckId: text("deck_id")
      .notNull()
      .references(() => flashcardDecks.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    front: text("front").notNull(),
    back: text("back").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    isFavorite: boolean("is_favorite").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    index("flashcards_deck_id_idx").on(t.deckId),
    index("flashcards_user_id_idx").on(t.userId),
  ]
);

export const flashcardReviews = pgTable(
  "flashcard_reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    flashcardId: text("flashcard_id")
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    easiness: real("easiness").notNull().default(2.5),
    interval: integer("interval").notNull().default(1),
    repetitions: integer("repetitions").notNull().default(0),
    nextReview: timestamp("next_review").$defaultFn(() => new Date()).notNull(),
    lastReview: timestamp("last_review"),
  },
  (t) => [
    index("reviews_user_id_idx").on(t.userId),
    index("reviews_flashcard_id_idx").on(t.flashcardId),
    index("reviews_next_review_idx").on(t.nextReview),
  ]
);

export const studySessions = pgTable(
  "study_sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    topic: text("topic"),
    durationSeconds: integer("duration_seconds").notNull(),
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at").notNull(),
  },
  (t) => [
    index("sessions_user_id_idx").on(t.userId),
    index("sessions_ended_at_idx").on(t.endedAt),
  ]
);

export const goals = pgTable(
  "goals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    targetType: text("target_type").notNull(),
    targetValue: integer("target_value").notNull(),
    period: text("period").notNull().default("daily"),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index("goals_user_id_idx").on(t.userId)]
);

export const editalItems = pgTable(
  "edital_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    editalName: text("edital_name").notNull().default("Meu Edital"),
    subject: text("subject").notNull(),
    topic: text("topic").notNull(),
    weight: integer("weight").default(0),
    priority: text("priority").notNull().default("média"),
    done: boolean("done").default(false),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index("edital_user_id_idx").on(t.userId)]
);

export const simulados = pgTable(
  "simulados",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    durationMinutes: integer("duration_minutes"),
    subjects: jsonb("subjects").$type<string[]>().default([]),
    score: integer("score"),
    correctAnswers: integer("correct_answers"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index("simulados_user_id_idx").on(t.userId)]
);

export const simuladoQuestions = pgTable(
  "simulado_questions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    simuladoId: text("simulado_id")
      .notNull()
      .references(() => simulados.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    selectedAnswer: text("selected_answer"),
    isCorrect: boolean("is_correct"),
    answeredAt: timestamp("answered_at"),
  },
  (t) => [index("sim_questions_simulado_id_idx").on(t.simuladoId)]
);

export const friendships = pgTable(
  "friendships",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: text("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    index("friendships_user_id_idx").on(t.userId),
    index("friendships_friend_id_idx").on(t.friendId),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Flashcard = typeof flashcards.$inferSelect;
export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type FlashcardReview = typeof flashcardReviews.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type EditalItem = typeof editalItems.$inferSelect;
export type Simulado = typeof simulados.$inferSelect;
export type QuestionAttempt = typeof questionAttempts.$inferSelect;
