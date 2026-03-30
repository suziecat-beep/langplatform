import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.collectionItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.mediaLink.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@langplatform.com",
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
    },
  });

  const contributor = await prisma.user.create({
    data: {
      email: "contributor@langplatform.com",
      name: "Sarah Chen",
      passwordHash,
      role: "CONTRIBUTOR",
    },
  });

  const learner = await prisma.user.create({
    data: {
      email: "learner@langplatform.com",
      name: "Alex Rivera",
      passwordHash,
      role: "LEARNER",
    },
  });

  console.log("Created users");

  // Resources
  const resourcesData = [
    { title: "Genki I: An Integrated Course in Elementary Japanese", description: "The gold standard textbook for beginning Japanese learners. Covers hiragana, katakana, basic kanji, and fundamental grammar patterns. Includes workbook exercises and audio materials for comprehensive learning.", language: "japanese", proficiencyLevel: "A1" as const, resourceType: "TEXTBOOK" as const, skillTags: ["READING" as const, "GRAMMAR" as const], contributorId: contributor.id },
    { title: "Genki II: An Integrated Course in Elementary Japanese", description: "Continuation of Genki I covering intermediate grammar, additional kanji, and more complex sentence structures. Perfect for learners transitioning from beginner to intermediate level.", language: "japanese", proficiencyLevel: "A2" as const, resourceType: "TEXTBOOK" as const, skillTags: ["READING" as const, "GRAMMAR" as const], contributorId: contributor.id },
    { title: "NHK World News Easy", description: "Simplified Japanese news articles with furigana readings, vocabulary lists, and audio recordings. Updated daily with current events written for language learners.", language: "japanese", proficiencyLevel: "B1" as const, resourceType: "ARTICLE" as const, skillTags: ["READING" as const, "LISTENING" as const], contributorId: admin.id, embedUrl: "https://www3.nhk.or.jp/news/easy/" },
    { title: "Japanese Listening Practice: Daily Conversations", description: "A collection of natural Japanese conversations at various speeds. Includes transcripts and vocabulary notes for each dialogue.", language: "japanese", proficiencyLevel: "A2" as const, resourceType: "AUDIO" as const, skillTags: ["LISTENING" as const, "SPEAKING" as const], contributorId: contributor.id },
    { title: "Tobira: Gateway to Advanced Japanese", description: "Intermediate to advanced textbook covering complex grammar, reading passages from authentic sources, and cultural topics. Bridges the gap between textbook Japanese and real-world usage.", language: "japanese", proficiencyLevel: "B2" as const, resourceType: "TEXTBOOK" as const, skillTags: ["READING" as const, "GRAMMAR" as const, "VOCABULARY" as const], contributorId: admin.id },
    { title: "JLPT N3 Kanji Flashcard Deck", description: "Complete set of 370 kanji required for the JLPT N3 exam. Each card includes readings, meanings, example words, and stroke order.", language: "japanese", proficiencyLevel: "B1" as const, resourceType: "FLASHCARD_DECK" as const, skillTags: ["READING" as const, "VOCABULARY" as const], contributorId: contributor.id },
    { title: "Japanese Graded Readers Level 1", description: "Easy-to-read stories written entirely in hiragana and basic kanji. Perfect for absolute beginners who want to practice reading comprehension.", language: "japanese", proficiencyLevel: "A1" as const, resourceType: "GRADED_READER" as const, skillTags: ["READING" as const], contributorId: contributor.id },
    { title: "Shadowing: Let's Speak Japanese (Beginner)", description: "Audio-based textbook using the shadowing technique to improve pronunciation and fluency. Listen and repeat natural Japanese phrases.", language: "japanese", proficiencyLevel: "A2" as const, resourceType: "AUDIO" as const, skillTags: ["LISTENING" as const, "SPEAKING" as const], contributorId: admin.id },
    { title: "French in Action Video Series", description: "Classic immersive French learning video series following the story of an American student in Paris. Natural dialogues with cultural context.", language: "french", proficiencyLevel: "A2" as const, resourceType: "VIDEO" as const, skillTags: ["LISTENING" as const, "SPEAKING" as const], contributorId: contributor.id },
    { title: "Alter Ego+ A1: French for Beginners", description: "Comprehensive French textbook with structured lessons covering basic grammar, pronunciation, and everyday vocabulary. Includes practice exercises and cultural notes.", language: "french", proficiencyLevel: "A1" as const, resourceType: "TEXTBOOK" as const, skillTags: ["READING" as const, "GRAMMAR" as const, "VOCABULARY" as const], contributorId: admin.id },
    { title: "French Pronunciation Workshop", description: "Detailed video workshop covering French phonetics, nasal vowels, liaisons, and common pronunciation pitfalls for English speakers.", language: "french", proficiencyLevel: "A1" as const, resourceType: "VIDEO" as const, skillTags: ["SPEAKING" as const, "LISTENING" as const], contributorId: contributor.id },
    { title: "Le Petit Prince — Graded Reader Edition", description: "Simplified version of Saint-Exupéry's classic with vocabulary annotations and comprehension questions. A beloved story adapted for intermediate French learners.", language: "french", proficiencyLevel: "B1" as const, resourceType: "GRADED_READER" as const, skillTags: ["READING" as const, "VOCABULARY" as const], contributorId: admin.id },
    { title: "French Grammar Drills: Subjunctive Mood", description: "Targeted worksheet set focusing on the French subjunctive — when to use it, formation rules, and 50+ practice exercises with answer key.", language: "french", proficiencyLevel: "B2" as const, resourceType: "WORKSHEET" as const, skillTags: ["GRAMMAR" as const, "WRITING" as const], contributorId: contributor.id },
    { title: "Advanced French Listening: France Inter Podcasts", description: "Curated collection of France Inter radio segments with transcripts. Covers current affairs, culture, and science at native speaker speed.", language: "french", proficiencyLevel: "C1" as const, resourceType: "AUDIO" as const, skillTags: ["LISTENING" as const], contributorId: admin.id },
    { title: "French B1 Vocabulary Flashcards", description: "2000+ essential French vocabulary words organized by theme. Includes example sentences, audio pronunciation, and spaced repetition scheduling.", language: "french", proficiencyLevel: "B1" as const, resourceType: "FLASHCARD_DECK" as const, skillTags: ["VOCABULARY" as const], contributorId: contributor.id },
    { title: "Spanish Verb Conjugation Drills", description: "Comprehensive worksheet covering present, preterite, imperfect, and subjunctive conjugations. Progressive difficulty with self-check answer keys.", language: "spanish", proficiencyLevel: "A2" as const, resourceType: "WORKSHEET" as const, skillTags: ["GRAMMAR" as const, "WRITING" as const], contributorId: contributor.id },
    { title: "Aula Internacional 1", description: "Popular Spanish textbook used in language schools worldwide. Communicative approach with authentic materials, grammar explanations, and cultural content.", language: "spanish", proficiencyLevel: "A1" as const, resourceType: "TEXTBOOK" as const, skillTags: ["READING" as const, "GRAMMAR" as const, "SPEAKING" as const], contributorId: admin.id },
    { title: "Notes in Spanish: Intermediate", description: "Podcast conversations between a native Spanish speaker and an English-speaking learner. Natural, unscripted discussions on everyday topics.", language: "spanish", proficiencyLevel: "B1" as const, resourceType: "AUDIO" as const, skillTags: ["LISTENING" as const, "VOCABULARY" as const], contributorId: contributor.id },
    { title: "Easy Spanish Street Interviews", description: "Video compilation of street interviews in Spanish-speaking countries. Real conversations with subtitles in both Spanish and English.", language: "spanish", proficiencyLevel: "A2" as const, resourceType: "VIDEO" as const, skillTags: ["LISTENING" as const, "SPEAKING" as const], contributorId: admin.id },
    { title: "Short Stories in Spanish for Beginners", description: "Eight captivating short stories written specifically for Spanish learners. Each story includes vocabulary lists, comprehension questions, and grammar notes.", language: "spanish", proficiencyLevel: "A2" as const, resourceType: "GRADED_READER" as const, skillTags: ["READING" as const, "VOCABULARY" as const], contributorId: contributor.id },
    { title: "Spanish Writing Prompts B1-B2", description: "50 creative writing prompts designed for intermediate Spanish learners. Includes sample responses and common expressions for each topic.", language: "spanish", proficiencyLevel: "B1" as const, resourceType: "WORKSHEET" as const, skillTags: ["WRITING" as const, "GRAMMAR" as const], contributorId: admin.id },
    { title: "Destinos: An Introduction to Spanish", description: "Television series following a mystery story across Spanish-speaking countries. 52 episodes with gradually increasing complexity.", language: "spanish", proficiencyLevel: "A1" as const, resourceType: "VIDEO" as const, skillTags: ["LISTENING" as const, "SPEAKING" as const, "VOCABULARY" as const], contributorId: contributor.id },
    { title: "DELE B2 Exam Preparation Pack", description: "Complete preparation materials for the DELE B2 exam including practice tests, answer keys, audio files, and exam strategy guides.", language: "spanish", proficiencyLevel: "B2" as const, resourceType: "WORKSHEET" as const, skillTags: ["READING" as const, "WRITING" as const, "LISTENING" as const, "SPEAKING" as const], contributorId: admin.id },
    { title: "Spanish Irregular Verb Flashcards", description: "Master 100 of the most common Spanish irregular verbs with conjugation tables, example sentences, and memory aids.", language: "spanish", proficiencyLevel: "A2" as const, resourceType: "FLASHCARD_DECK" as const, skillTags: ["GRAMMAR" as const, "VOCABULARY" as const], contributorId: contributor.id },
    { title: "Advanced Spanish: El País Article Analysis", description: "Curated articles from El País newspaper with vocabulary annotations, cultural context explanations, and discussion questions for advanced learners.", language: "spanish", proficiencyLevel: "C1" as const, resourceType: "ARTICLE" as const, skillTags: ["READING" as const, "VOCABULARY" as const], contributorId: admin.id },
  ];

  const resources = [];
  for (const data of resourcesData) {
    const resource = await prisma.resource.create({
      data: {
        ...data,
        status: "APPROVED",
        avgRating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 20) + 1,
        downloadCount: Math.floor(Math.random() * 500) + 10,
      },
    });
    resources.push(resource);
  }

  console.log(`Created ${resources.length} resources`);

  // Collections
  const japaneseCollection = await prisma.collection.create({
    data: {
      title: "Complete Japanese Beginner Path",
      description: "Everything you need to go from zero to conversational Japanese. Start with Genki I and work your way through these carefully ordered resources.",
      language: "japanese",
      creatorId: contributor.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "japanese")
          .slice(0, 5)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  const frenchCollection = await prisma.collection.create({
    data: {
      title: "French B1 Study Plan",
      description: "Curated resources to reach intermediate French proficiency. Focuses on reading, listening, and grammar.",
      language: "french",
      creatorId: admin.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "french")
          .slice(0, 4)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  const spanishCollection = await prisma.collection.create({
    data: {
      title: "Spanish for Travel",
      description: "Essential Spanish resources for travelers. Learn practical vocabulary and conversational skills.",
      language: "spanish",
      creatorId: contributor.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "spanish")
          .slice(0, 4)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  const examPrepCollection = await prisma.collection.create({
    data: {
      title: "DELE B2 Exam Prep",
      description: "All the resources you need to prepare for and pass the DELE B2 Spanish exam.",
      language: "spanish",
      creatorId: admin.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "spanish" && ["B1", "B2"].includes(r.proficiencyLevel))
          .slice(0, 3)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  console.log("Created collections");

  // Reviews
  const reviewers = [admin, contributor, learner];
  const reviewData = [
    { resourceIdx: 0, userId: learner.id, rating: 5, comment: "The best Japanese textbook for beginners, hands down. The progression is perfect and the exercises are really helpful." },
    { resourceIdx: 0, userId: admin.id, rating: 4, comment: "Great textbook but the pace can be fast for self-study. Works best with a teacher or study group." },
    { resourceIdx: 2, userId: learner.id, rating: 5, comment: "I read NHK News Easy every morning. The furigana and vocabulary lists make it accessible even at my level." },
    { resourceIdx: 2, userId: contributor.id, rating: 4, comment: "Excellent free resource. The audio recordings are clear and the articles are genuinely interesting." },
    { resourceIdx: 8, userId: learner.id, rating: 5, comment: "French in Action is amazing! The immersive approach really works. I watch one episode every day." },
    { resourceIdx: 9, userId: learner.id, rating: 4, comment: "Solid textbook with good exercises. The cultural notes add nice context." },
    { resourceIdx: 11, userId: admin.id, rating: 5, comment: "Beautiful adaptation. The vocabulary annotations are perfectly placed and the comprehension questions really test understanding." },
    { resourceIdx: 15, userId: learner.id, rating: 4, comment: "These drills really helped me master the conjugations. The progressive difficulty is well thought out." },
    { resourceIdx: 16, userId: contributor.id, rating: 5, comment: "The communicative approach in this textbook is excellent. Feels like you're learning to actually use the language." },
    { resourceIdx: 18, userId: learner.id, rating: 5, comment: "So fun to watch! Real conversations with real people. The subtitles help a lot." },
    { resourceIdx: 19, userId: admin.id, rating: 4, comment: "Engaging stories with just the right level of challenge. Great for building reading fluency." },
    { resourceIdx: 21, userId: learner.id, rating: 5, comment: "Love this show! Each episode builds on the last and the mystery keeps you motivated to continue." },
  ];

  for (const rd of reviewData) {
    await prisma.review.create({
      data: {
        resourceId: resources[rd.resourceIdx].id,
        userId: rd.userId,
        rating: rd.rating,
        comment: rd.comment,
        helpfulnessVotes: Math.floor(Math.random() * 15),
      },
    });
  }

  // Update avgRating for reviewed resources
  const uniqueIndices = Array.from(new Set(reviewData.map((r) => r.resourceIdx)));
  for (const idx of uniqueIndices) {
    const agg = await prisma.review.aggregate({
      where: { resourceId: resources[idx].id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.resource.update({
      where: { id: resources[idx].id },
      data: { avgRating: agg._avg.rating || 0, ratingCount: agg._count.rating },
    });
  }

  console.log("Created reviews");

  // Media Links
  const mediaLinksData = [
    { title: "Japanese Ammo with Misa", url: "https://www.youtube.com/c/JapaneseAmmowithMisa", platform: "YOUTUBE" as const, language: "japanese", proficiencyLevel: "A2" as const, submittedById: contributor.id },
    { title: "Nihongo con Teppei (Beginner)", url: "https://nihongoconteppei.com/", platform: "PODCAST" as const, language: "japanese", proficiencyLevel: "A2" as const, submittedById: admin.id },
    { title: "NHK World Japan", url: "https://www3.nhk.or.jp/nhkworld/", platform: "NEWS" as const, language: "japanese", proficiencyLevel: "B2" as const, submittedById: contributor.id },
    { title: "InnerFrench Podcast", url: "https://innerfrench.com/podcast/", platform: "PODCAST" as const, language: "french", proficiencyLevel: "B1" as const, submittedById: admin.id },
    { title: "Français avec Pierre", url: "https://www.youtube.com/c/FrancaisavecPierre", platform: "YOUTUBE" as const, language: "french", proficiencyLevel: "A2" as const, submittedById: contributor.id },
    { title: "Journal en français facile", url: "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/journal-en-francais-facile", platform: "NEWS" as const, language: "french", proficiencyLevel: "B1" as const, submittedById: admin.id },
    { title: "Dreaming Spanish", url: "https://www.youtube.com/c/DreamingSpanish", platform: "YOUTUBE" as const, language: "spanish", proficiencyLevel: "A1" as const, submittedById: contributor.id },
    { title: "Coffee Break Spanish", url: "https://coffeebreaklanguages.com/coffeebreakspanish/", platform: "PODCAST" as const, language: "spanish", proficiencyLevel: "A2" as const, submittedById: admin.id },
  ];

  for (const ml of mediaLinksData) {
    await prisma.mediaLink.create({
      data: { ...ml, upvotes: Math.floor(Math.random() * 50) + 5 },
    });
  }

  console.log("Created media links");

  // Some bookmarks for the learner
  await prisma.bookmark.createMany({
    data: [
      { userId: learner.id, resourceId: resources[0].id, status: "IN_PROGRESS" },
      { userId: learner.id, resourceId: resources[2].id, status: "TO_STUDY" },
      { userId: learner.id, resourceId: resources[5].id, status: "TO_STUDY" },
      { userId: learner.id, resourceId: resources[8].id, status: "COMPLETED" },
    ],
  });

  console.log("Created bookmarks");
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
