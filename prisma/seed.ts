import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { resourceContent } from "./seed-content";

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

  // ── Users ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { email: "admin@langplatform.com", name: "Admin User", passwordHash, role: "ADMIN" },
  });
  const contributor = await prisma.user.create({
    data: { email: "contributor@langplatform.com", name: "Sarah Chen", passwordHash, role: "CONTRIBUTOR" },
  });
  const learner = await prisma.user.create({
    data: { email: "learner@langplatform.com", name: "Alex Rivera", passwordHash, role: "LEARNER" },
  });
  const yukiT = await prisma.user.create({
    data: { email: "yuki@langplatform.com", name: "Yuki Tanaka", passwordHash, role: "CONTRIBUTOR" },
  });
  const marieD = await prisma.user.create({
    data: { email: "marie@langplatform.com", name: "Marie Dupont", passwordHash, role: "CONTRIBUTOR" },
  });
  const carlosM = await prisma.user.create({
    data: { email: "carlos@langplatform.com", name: "Carlos Mendez", passwordHash, role: "CONTRIBUTOR" },
  });
  const jordanK = await prisma.user.create({
    data: { email: "jordan@langplatform.com", name: "Jordan Kim", passwordHash, role: "LEARNER" },
  });
  const priyaS = await prisma.user.create({
    data: { email: "priya@langplatform.com", name: "Priya Sharma", passwordHash, role: "CONTRIBUTOR" },
  });

  console.log("Created users");

  // ── Resources ──────────────────────────────────────────────────────────────
  const resourcesData = [
    // ─── Japanese (8) ───
    {
      title: "Genki I: An Integrated Course in Elementary Japanese",
      description:
        "The gold standard textbook for beginning Japanese learners. Genki I has been the go-to choice for university courses and self-study for over two decades, and for good reason — it strikes the perfect balance between thorough grammar explanations and practical conversation practice.\n\nThe textbook covers 23 lessons starting from self-introductions and daily routines, progressing through expressing preferences, describing past events, making requests, and giving directions. You will learn all hiragana and katakana, approximately 145 kanji, and around 1,100 vocabulary words. Each chapter includes dialogue sections set in realistic college-life scenarios, clear grammar notes with abundant examples, and a variety of practice exercises.\n\nFor best results, pair this with the Genki I Workbook for additional written practice and the companion audio materials for listening comprehension. Most learners complete Genki I in four to six months of consistent study. The textbook is widely supported with community-made answer keys and supplementary Anki decks available online.",
      language: "japanese",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const],
      contributorId: yukiT.id,
      embedUrl: "https://genki.japantimes.co.jp/",
      thumbnailUrl: "https://picsum.photos/seed/genki-i/640/360",
    },
    {
      title: "Genki II: An Integrated Course in Elementary Japanese",
      description:
        "The continuation of the best-selling Genki I, this textbook takes learners from upper-beginner to lower-intermediate Japanese. If you have completed Genki I or have equivalent foundational knowledge, this is your natural next step.\n\nGenki II covers lessons 13 through 23, introducing increasingly complex grammar patterns such as the potential form, volitional form, conditional expressions, passive and causative constructions, and honorific language. The textbook adds approximately 150 new kanji and 700 vocabulary words, and the dialogues shift from simple campus life conversations to topics like travel, health, job hunting, and cultural experiences.\n\nThe pacing is noticeably faster than Genki I — each chapter introduces more grammar points and expects greater reading fluency. Many learners find it helpful to supplement with additional reading practice at this stage. After completing Genki II, you will be well-prepared for the JLPT N4 exam and ready to transition to intermediate materials like Tobira.",
      language: "japanese",
      proficiencyLevel: "A2" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const],
      contributorId: yukiT.id,
      embedUrl: "https://genki.japantimes.co.jp/",
      thumbnailUrl: "https://picsum.photos/seed/genki-ii/640/360",
    },
    {
      title: "NHK World News Easy",
      description:
        "NHK News Web Easy is a free daily news service produced by Japan's national broadcaster specifically for language learners and elementary school students. Every article is written in simplified Japanese with furigana readings above all kanji, making it accessible even for lower-intermediate learners.\n\nThe site publishes four to five articles per day covering current events in Japan and around the world — politics, weather, sports, technology, and human interest stories. Each article includes an audio recording read at a measured pace, a built-in dictionary that highlights and defines difficult words, and color-coded grammar markers. Articles typically run 200 to 400 characters, making them manageable for daily reading practice.\n\nThis resource is most effective as a daily habit. Try reading one article per morning, first without audio, then listening along while re-reading. Keep a vocabulary notebook for new words you encounter repeatedly. As your reading speed improves, you can challenge yourself with the regular NHK News articles linked at the bottom of each simplified version.",
      language: "japanese",
      proficiencyLevel: "B1" as const,
      resourceType: "ARTICLE" as const,
      skillTags: ["READING" as const, "LISTENING" as const],
      contributorId: admin.id,
      embedUrl: "https://www3.nhk.or.jp/news/easy/",
      thumbnailUrl: "https://picsum.photos/seed/nhk-easy/640/360",
    },
    {
      title: "Japanese Listening Practice: Daily Conversations",
      description:
        "A carefully curated collection of natural Japanese conversations recorded at three different speeds — slow, normal, and native pace. Each dialogue features two native speakers in everyday situations such as ordering at a restaurant, asking for directions, shopping, and catching up with friends.\n\nThe collection includes 40 dialogues organized by theme and difficulty. Every conversation comes with a full Japanese transcript, English translation, vocabulary list with readings and example sentences, and grammar notes explaining key patterns used in the dialogue. The slow-speed versions are particularly helpful for beginners who struggle to parse spoken Japanese at natural speed.\n\nFor optimal results, try the three-pass method: listen once without the transcript to test your comprehension, listen again with the Japanese transcript to identify words you missed, then listen a third time at native speed to build your processing speed. This resource pairs well with shadowing practice — try repeating each line immediately after hearing it to improve your pronunciation and rhythm.",
      language: "japanese",
      proficiencyLevel: "A2" as const,
      resourceType: "AUDIO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const],
      contributorId: yukiT.id,
      embedUrl: "https://www.japanesepod101.com/",
      thumbnailUrl: "https://picsum.photos/seed/jp-listening/640/360",
    },
    {
      title: "Tobira: Gateway to Advanced Japanese",
      description:
        "Tobira is the definitive bridge from intermediate to advanced Japanese. Designed for learners who have completed Genki II or an equivalent foundation, this textbook immerses you in authentic Japanese content drawn from real newspaper articles, essays, literature, and media.\n\nThe textbook contains 15 chapters organized around cultural and social themes — Japanese geography, pop culture, technology, education, history, and social issues. Each chapter opens with a substantial reading passage followed by detailed grammar explanations, kanji study sections introducing roughly 800 kanji total, and extensive discussion questions. Unlike beginner textbooks, Tobira expects you to engage critically with the content, express opinions, and handle ambiguity.\n\nTobira is demanding but transformative. The leap from Genki to Tobira is significant — many learners benefit from supplementing with graded readers or NHK News Easy during the transition. The textbook has a companion website with audio files, video clips, and interactive kanji practice. Allow eight to twelve months for completion at a steady pace.",
      language: "japanese",
      proficiencyLevel: "B2" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "VOCABULARY" as const],
      contributorId: admin.id,
      embedUrl: "https://tobiraweb.9640.jp/",
      thumbnailUrl: "https://picsum.photos/seed/tobira/640/360",
    },
    {
      title: "JLPT N3 Kanji Flashcard Deck",
      description:
        "A comprehensive flashcard deck covering all 370 kanji required for the Japanese Language Proficiency Test N3 level. Each card is designed for effective spaced-repetition study with multiple information fields to reinforce retention from different angles.\n\nEvery flashcard includes the kanji character, all on'yomi and kun'yomi readings, English meanings, three to five example compound words with readings, stroke order diagrams, and a mnemonic hint to aid memorization. The cards are organized into thematic groups — nature, society, emotions, actions, descriptions — so you learn kanji in meaningful clusters rather than in isolation.\n\nFor best results, study 10 to 15 new cards per day while reviewing previous cards through spaced repetition. Import this deck into Anki or a similar flashcard app to take advantage of automatic scheduling algorithms. Pair this with real reading practice — you will retain kanji much better when you encounter them in context shortly after learning them.",
      language: "japanese",
      proficiencyLevel: "B1" as const,
      resourceType: "FLASHCARD_DECK" as const,
      skillTags: ["READING" as const, "VOCABULARY" as const],
      contributorId: yukiT.id,
      embedUrl: "https://ankiweb.net/shared/info/1956010488",
      thumbnailUrl: "https://picsum.photos/seed/jlpt-n3-kanji/640/360",
    },
    {
      title: "Japanese Graded Readers Level 1",
      description:
        "A set of ten charming short stories written entirely in hiragana and basic kanji with furigana, designed specifically for absolute beginners who want to experience the joy of reading in Japanese from the very start. Each story runs two to four pages with colorful illustrations that support comprehension.\n\nThe stories range from simple narratives about daily life — a trip to the convenience store, a day at school, a visit to the park — to retold Japanese folktales like Momotaro and Tsuru no Ongaeshi. Vocabulary is carefully controlled to stay within the most common 300 words, and grammar is limited to present and past tense with basic particles. A glossary at the back of each story defines any words that might be unfamiliar.\n\nGraded readers are one of the most effective tools for building reading fluency. Read each story multiple times — first for general understanding, then to absorb natural phrasing and word order. Try reading aloud to practice pronunciation. As you gain confidence, move on to Level 2 where katakana and more kanji are introduced.",
      language: "japanese",
      proficiencyLevel: "A1" as const,
      resourceType: "GRADED_READER" as const,
      skillTags: ["READING" as const],
      contributorId: contributor.id,
      embedUrl: "https://tadoku.org/japanese/en/free-books-en/",
      thumbnailUrl: "https://picsum.photos/seed/jp-graded-readers/640/360",
    },
    {
      title: "Shadowing: Let's Speak Japanese (Beginner)",
      description:
        "An audio-based training program built around the shadowing technique — listening to native Japanese speech and repeating it immediately, almost simultaneously. This method is used by professional interpreters and has been adapted here for language learners at the beginner level.\n\nThe program includes 50 short dialogues and monologues covering everyday situations: greetings, self-introductions, asking about schedules, describing your neighborhood, talking about hobbies, and more. Each segment is presented three ways — at slow speed with pauses for repetition, at natural speed for shadowing practice, and with background music for review listening. A booklet with full transcripts and translations accompanies the audio.\n\nShadowing builds multiple skills at once: listening comprehension, pronunciation, intonation, speaking rhythm, and even vocabulary retention. Start with the slow versions and gradually work up to shadowing at natural speed. Practice for 15 to 20 minutes daily for the best results. Many learners report noticeable pronunciation improvements within two to three weeks of consistent shadowing practice.",
      language: "japanese",
      proficiencyLevel: "A2" as const,
      resourceType: "AUDIO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const],
      contributorId: admin.id,
      embedUrl: "https://www.amazon.co.jp/dp/4874243916",
      thumbnailUrl: "https://picsum.photos/seed/shadowing-jp/640/360",
    },

    // ─── French (7) ───
    {
      title: "French in Action Video Series",
      description:
        "A classic immersive French learning series that follows the story of Robert, an American student who falls in love with Mireille during a summer in Paris. Created by Yale University professor Pierre Capretz, this series has introduced millions of learners to French through compelling storytelling rather than dry grammar drills.\n\nThe series comprises 52 episodes that progressively introduce all major French grammar structures and a vocabulary of over 3,000 words. Each episode weaves together narrative segments filmed on location in France, grammar explanations, cultural vignettes, and comprehension exercises. The approach is heavily input-based — you absorb French naturally through context and repetition, much like a child acquiring their first language.\n\nFrench in Action works best as a daily habit. Watch one episode per day, letting the story carry you forward even when you do not understand every word. The repetition built into the series means you will encounter key vocabulary and structures many times across different contexts. Pair this with the companion textbook and workbook for a complete university-level French course.",
      language: "french",
      proficiencyLevel: "A2" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const],
      contributorId: marieD.id,
      embedUrl: "https://www.youtube.com/watch?v=lfDpB-0bJJQ",
      thumbnailUrl: "https://picsum.photos/seed/french-in-action/640/360",
    },
    {
      title: "Alter Ego+ A1: French for Beginners",
      description:
        "One of the most widely used French textbooks in language schools across Europe and Latin America. Alter Ego+ takes a communicative, action-oriented approach aligned with the Common European Framework of Reference, meaning every lesson is built around practical tasks you will actually need to perform in French.\n\nThe A1 level covers nine dossiers progressing from basic introductions and personal descriptions to talking about daily routines, expressing preferences, describing your home and neighborhood, making plans, and recounting past events. Each dossier includes authentic documents — real advertisements, emails, blog posts, and forms — alongside structured grammar explanations and pronunciation exercises. Cultural notes throughout provide context about French daily life, customs, and social norms.\n\nThe textbook is designed for classroom use but works well for self-study when paired with the audio CD and accompanying workbook. Each dossier takes roughly two weeks to complete, putting the total course duration at about four months. The grammar progression is gentle but thorough, and the emphasis on real-world communication means you will be able to handle basic French interactions well before finishing the book.",
      language: "french",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "VOCABULARY" as const],
      contributorId: admin.id,
      embedUrl: "https://www.hachettefle.com/adultes/pages/alter-ego-plus",
      thumbnailUrl: "https://picsum.photos/seed/alter-ego/640/360",
    },
    {
      title: "French Pronunciation Workshop",
      description:
        "A focused video workshop that systematically covers every challenging aspect of French pronunciation for English speakers. If you have ever struggled with the French 'r', nasal vowels, or knowing when to pronounce a final consonant, this workshop will give you clear, actionable guidance.\n\nThe workshop is divided into twelve modules covering: the French vowel system (including the critical u/ou distinction), nasal vowels (an, en, in, on, un), the French 'r' and 'l', consonant clusters, liaison rules, elision, the silent 'e', and sentence-level intonation patterns. Each module includes slow-motion demonstrations of mouth position, minimal pair exercises for training your ear, and practice sentences with recording prompts so you can compare your pronunciation to the model.\n\nPronunciation is often neglected in traditional courses, but it is the foundation of being understood. Work through one module per week and practice the exercises daily — even five minutes of focused pronunciation practice makes a significant difference. Record yourself and compare with the model audio. Many learners find that dedicated pronunciation work also dramatically improves their listening comprehension.",
      language: "french",
      proficiencyLevel: "A1" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["SPEAKING" as const, "LISTENING" as const],
      contributorId: marieD.id,
      embedUrl: "https://www.youtube.com/watch?v=pz0XgAKR9Oc",
      thumbnailUrl: "https://picsum.photos/seed/french-pronunciation/640/360",
    },
    {
      title: "Le Petit Prince — Graded Reader Edition",
      description:
        "A carefully simplified version of Antoine de Saint-Exupéry's beloved classic, adapted for intermediate French learners. This graded reader preserves the poetic spirit and philosophical depth of the original while reducing vocabulary and grammar complexity to the B1 level.\n\nThe adapted text retains all major episodes — the narrator's plane crash in the Sahara, the Little Prince's visits to the asteroids, his encounters with the king, the vain man, the drunkard, the businessman, the lamplighter, and the geographer, and of course his friendship with the fox and the rose. Vocabulary annotations appear in the margins, comprehension questions follow each chapter, and a glossary at the back covers all words beyond the 2,000 most common in French.\n\nReading adapted literature is one of the most rewarding ways to build intermediate reading skills. The familiar story provides scaffolding that helps you push through unfamiliar vocabulary, and the philosophical themes give you rich material for reflection and discussion. After finishing this version, challenge yourself with the original unabridged text — you may be surprised how much you can understand.",
      language: "french",
      proficiencyLevel: "B1" as const,
      resourceType: "GRADED_READER" as const,
      skillTags: ["READING" as const, "VOCABULARY" as const],
      contributorId: admin.id,
      embedUrl: "https://www.lire-en-francais.com/le-petit-prince/",
      thumbnailUrl: "https://picsum.photos/seed/petit-prince/640/360",
    },
    {
      title: "French Grammar Drills: Subjunctive Mood",
      description:
        "A targeted worksheet collection focusing exclusively on the French subjunctive — one of the most challenging grammar topics for learners at the upper-intermediate level. These drills take you from understanding when the subjunctive is required to using it naturally and confidently.\n\nThe collection contains five sections with over 50 exercises total: identifying subjunctive triggers (verbs of emotion, doubt, necessity, desire), forming regular and irregular subjunctive conjugations, choosing between indicative and subjunctive in context, translating sentences that require subjunctive thinking, and free-response exercises where you compose original sentences. Each section includes worked examples and an answer key with detailed explanations for common mistakes.\n\nThe subjunctive often intimidates learners, but it follows clear patterns once you internalize the trigger categories. Work through one section per study session, check your answers carefully, and revisit any exercises where you made errors after a few days. Pay special attention to the contrast exercises — the ability to choose correctly between indicative and subjunctive is what separates intermediate from advanced French speakers.",
      language: "french",
      proficiencyLevel: "B2" as const,
      resourceType: "WORKSHEET" as const,
      skillTags: ["GRAMMAR" as const, "WRITING" as const],
      contributorId: marieD.id,
      embedUrl: "https://www.lawlessfrench.com/grammar/subjunctive/",
      thumbnailUrl: "https://picsum.photos/seed/french-subjunctive/640/360",
    },
    {
      title: "Advanced French Listening: France Inter Podcasts",
      description:
        "A curated selection of segments from France Inter, one of France's most popular public radio stations. These authentic broadcasts cover current affairs, culture, science, literature, and social commentary at full native-speaker speed — the real test of your French listening comprehension.\n\nThe collection includes 30 segments ranging from five to twenty minutes, organized by difficulty and topic. Easier segments feature structured interviews with clear diction, while advanced segments include rapid panel discussions, phone-in shows, and investigative reports with multiple speakers, overlapping dialogue, and regional accents. Each segment comes with a full transcript, vocabulary notes for idiomatic expressions and slang, and comprehension questions.\n\nAt the C1 level, your goal shifts from understanding individual words to following arguments, catching nuance, and recognizing rhetorical devices. Listen to each segment at least twice — once for the main argument, once for details. Flag any expressions you would like to incorporate into your own speech. This resource is particularly valuable for learners preparing for the DALF C1 listening section or anyone who wants to understand French media as a native would.",
      language: "french",
      proficiencyLevel: "C1" as const,
      resourceType: "AUDIO" as const,
      skillTags: ["LISTENING" as const],
      contributorId: admin.id,
      embedUrl: "https://www.radiofrance.fr/franceinter",
      thumbnailUrl: "https://picsum.photos/seed/france-inter/640/360",
    },
    {
      title: "French B1 Vocabulary Flashcards",
      description:
        "A comprehensive flashcard deck containing over 2,000 essential French vocabulary words organized into 40 thematic categories — food and cooking, travel and transportation, work and careers, health and body, emotions and personality, nature and environment, technology, and many more.\n\nEach card features the French word with gender marking, an English translation, a full example sentence demonstrating natural usage, an audio pronunciation recorded by a native speaker, and common collocations or related expressions. Cards are tagged by theme and CEFR level so you can filter your study sessions by topic or focus on words at your current level.\n\nImport this deck into Anki or your preferred spaced-repetition app and study 15 to 20 new cards per day while reviewing due cards. The thematic organization means you can align your vocabulary study with your textbook units or areas of personal interest. After completing this deck, you will have a solid working vocabulary for everyday French communication and will be well-prepared for the DELF B1 vocabulary requirements.",
      language: "french",
      proficiencyLevel: "B1" as const,
      resourceType: "FLASHCARD_DECK" as const,
      skillTags: ["VOCABULARY" as const],
      contributorId: marieD.id,
      embedUrl: "https://ankiweb.net/shared/info/893324022",
      thumbnailUrl: "https://picsum.photos/seed/french-b1-vocab/640/360",
    },

    // ─── Spanish (10) ───
    {
      title: "Spanish Verb Conjugation Drills",
      description:
        "A comprehensive set of conjugation worksheets covering the four most essential Spanish tenses: present indicative, preterite, imperfect, and present subjunctive. Designed for learners who understand the theory but need intensive practice to build automatic recall.\n\nThe collection is organized into four main sections with progressive difficulty within each. You start with regular -ar, -er, and -ir verbs, move to common stem-changing verbs, tackle the most frequent irregular verbs (ser, estar, ir, tener, hacer, poder, querer, saber, and more), and finish with mixed exercises that require you to choose the correct tense based on context. Each section includes 15 to 20 exercises with a self-check answer key.\n\nConjugation fluency is the backbone of Spanish communication — you simply cannot speak or write effectively if you have to stop and think about verb forms. Set a timer and try to complete each exercise page within five minutes. Repeat any sections where your accuracy falls below 80 percent. Most learners find that two weeks of daily drill practice produces dramatic improvement in both speaking and writing fluency.",
      language: "spanish",
      proficiencyLevel: "A2" as const,
      resourceType: "WORKSHEET" as const,
      skillTags: ["GRAMMAR" as const, "WRITING" as const],
      contributorId: carlosM.id,
      embedUrl: "https://www.conjugacion.es/",
      thumbnailUrl: "https://picsum.photos/seed/spanish-verbs/640/360",
    },
    {
      title: "Aula Internacional 1",
      description:
        "One of the most popular Spanish textbooks used in language schools worldwide, particularly across Europe and Latin America. Aula Internacional takes a communicative, task-based approach where every lesson culminates in a practical project that integrates the grammar, vocabulary, and cultural knowledge you have learned.\n\nThe textbook covers 12 units progressing from personal introductions and nationalities through daily routines, describing your city, food and restaurants, travel experiences, and making future plans. Each unit includes authentic materials — real advertisements, menus, maps, social media posts, and newspaper clippings from across the Spanish-speaking world. Grammar is introduced in context rather than in isolation, and the cultural content spans Spain, Mexico, Argentina, Colombia, and other countries.\n\nAula Internacional is designed for classroom use but adapts well to self-study with the companion audio and workbook. The textbook's greatest strength is its emphasis on communication from day one — you practice speaking, writing, and interacting in every lesson rather than memorizing rules. Plan about three weeks per unit for a comfortable self-study pace.",
      language: "spanish",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "SPEAKING" as const],
      contributorId: admin.id,
      embedUrl: "https://www.difusion.com/aula-internacional-nueva-edicion-1-libro-del-alumno-ejercicios-cd/",
      thumbnailUrl: "https://picsum.photos/seed/aula-internacional/640/360",
    },
    {
      title: "Notes in Spanish: Intermediate",
      description:
        "A podcast featuring unscripted conversations between Ben, a native English speaker who learned Spanish as an adult, and Marina, his native Spanish wife. Their natural, relaxed discussions cover everyday topics — food, travel, family, current events, Spanish culture, and the quirks of bilingual life.\n\nThe intermediate series includes over 40 episodes of 15 to 25 minutes each, recorded at a pace that is natural but accessible for B1-level learners. Ben occasionally asks Marina to explain expressions or slow down, which mirrors the experience of a real learner in conversation. Episode topics range from Spanish holidays and regional cuisine to technology habits and childhood memories. Transcripts and vocabulary worksheets are available for each episode.\n\nThis podcast fills a critical gap between textbook audio (too slow, too scripted) and native media (too fast, too complex). Listen during commutes, walks, or chores to build passive listening stamina. Try listening once without the transcript, then again with it to catch what you missed. The conversational format also gives you natural models for how real discussions flow in Spanish — invaluable for developing your own speaking style.",
      language: "spanish",
      proficiencyLevel: "B1" as const,
      resourceType: "AUDIO" as const,
      skillTags: ["LISTENING" as const, "VOCABULARY" as const],
      contributorId: carlosM.id,
      embedUrl: "https://www.notesinspanish.com/",
      thumbnailUrl: "https://picsum.photos/seed/notes-in-spanish/640/360",
    },
    {
      title: "Easy Spanish Street Interviews",
      description:
        "A collection of street interview videos filmed in cities across the Spanish-speaking world — Madrid, Mexico City, Bogotá, Buenos Aires, and more. Real people answer questions about their lives, opinions, and cultures in natural, unscripted Spanish with subtitles in both Spanish and English.\n\nThe collection features over 30 videos of five to twelve minutes each, organized by topic and difficulty. Easier videos feature single-speaker responses to simple questions (What is your favorite food? What do you do for a living?) while more challenging videos include group conversations, debates, and responses to abstract questions about happiness, culture, and social issues. The variety of accents and speaking styles across different countries makes this an excellent resource for developing flexible listening skills.\n\nStreet interviews are uniquely valuable because they expose you to the full range of natural speech — hesitations, filler words, incomplete sentences, slang, and the beautiful diversity of Spanish accents around the world. Watch with Spanish subtitles first, then try watching without subtitles. Pay attention to how speakers from different countries use different vocabulary and expressions for the same concepts.",
      language: "spanish",
      proficiencyLevel: "A2" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const],
      contributorId: admin.id,
      embedUrl: "https://www.youtube.com/watch?v=MIc4pFMVmFg",
      thumbnailUrl: "https://picsum.photos/seed/easy-spanish/640/360",
    },
    {
      title: "Short Stories in Spanish for Beginners",
      description:
        "Eight captivating short stories written specifically for Spanish learners at the A2 level. Each story features engaging characters and plots — a mystery in a small Andalusian village, a road trip across Patagonia, a cooking competition in Mexico City — that keep you reading while naturally reinforcing common vocabulary and grammar patterns.\n\nEach story is eight to twelve pages long and uses controlled vocabulary of approximately 1,000 words. Grammar is limited to present, preterite, and imperfect tenses with occasional subjunctive for advanced readers to encounter naturally. After each story you will find a vocabulary list with English translations, ten comprehension questions, a grammar spotlight explaining a key structure used in the story, and discussion prompts for conversation practice.\n\nRead each story twice — once for enjoyment and general understanding, and once more slowly to study new vocabulary and grammar in context. The stories are designed to be completed in a single sitting of 20 to 30 minutes, making them perfect for daily reading sessions. This format bridges the gap between textbook exercises and authentic literature, building the confidence you need to eventually tackle real Spanish novels.",
      language: "spanish",
      proficiencyLevel: "A2" as const,
      resourceType: "GRADED_READER" as const,
      skillTags: ["READING" as const, "VOCABULARY" as const],
      contributorId: carlosM.id,
      embedUrl: "https://www.amazon.com/dp/1838574085",
      thumbnailUrl: "https://picsum.photos/seed/spanish-stories/640/360",
    },
    {
      title: "Spanish Writing Prompts B1-B2",
      description:
        "Fifty creative writing prompts designed for intermediate Spanish learners who want to develop their written expression beyond basic sentence construction. Each prompt is crafted to elicit specific grammar structures and vocabulary themes appropriate for the B1-B2 level.\n\nPrompts are organized into five categories: narrative writing (tell a story about...), descriptive writing (describe a place, person, or experience), opinion essays (argue for or against...), practical writing (compose an email, complaint letter, or review), and creative writing (continue this story, write from a different perspective). Each prompt includes suggested vocabulary, three to five useful expressions, a model response of 150 to 200 words, and notes on common errors to avoid.\n\nWriting is often the most neglected skill, but it forces you to actively produce language rather than passively consume it. Aim to complete two to three prompts per week, spending 20 to 30 minutes on each. After writing, compare your response with the model — not to copy it, but to notice different ways of expressing similar ideas. If possible, find a language exchange partner who can provide feedback on your writing.",
      language: "spanish",
      proficiencyLevel: "B1" as const,
      resourceType: "WORKSHEET" as const,
      skillTags: ["WRITING" as const, "GRAMMAR" as const],
      contributorId: admin.id,
      embedUrl: "https://www.profedeele.es/actividad/expresion-escrita/",
      thumbnailUrl: "https://picsum.photos/seed/spanish-writing/640/360",
    },
    {
      title: "Destinos: An Introduction to Spanish",
      description:
        "An iconic television series that teaches Spanish through an unfolding mystery story spanning the entire Spanish-speaking world. Produced by WGBH Boston, Destinos follows Raquel Rodriguez, a Mexican-American lawyer, as she investigates a secret from the past of a dying Spanish patriarch.\n\nThe series comprises 52 half-hour episodes filmed on location in Spain, Mexico, Argentina, and Puerto Rico. Each episode introduces new vocabulary and grammar while advancing the gripping storyline — who is the mysterious woman in the old photograph? Each episode builds on the previous one with careful recycling of key vocabulary and structures, and the gradually increasing complexity means you are always working just above your current level.\n\nDestinos is remarkably effective because the story creates genuine motivation to continue — you want to find out what happens next, and that drive carries you through challenging new material. Watch one episode per day and take brief notes on new words. The series is freely available online. After completing all 52 episodes, most learners find they have absorbed a substantial foundation in Spanish grammar and vocabulary almost without realizing it.",
      language: "spanish",
      proficiencyLevel: "A1" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const, "VOCABULARY" as const],
      contributorId: carlosM.id,
      embedUrl: "https://www.youtube.com/watch?v=ADhtEoGjjFo",
      thumbnailUrl: "https://picsum.photos/seed/destinos/640/360",
    },
    {
      title: "DELE B2 Exam Preparation Pack",
      description:
        "A complete preparation package for the DELE B2 examination, the globally recognized certificate of upper-intermediate Spanish proficiency. This pack covers all four exam sections — reading comprehension, written expression, listening comprehension, and oral expression — with strategies, practice materials, and full mock exams.\n\nThe pack includes three complete practice tests that mirror the real exam format and timing, with answer keys and scoring rubrics. For reading comprehension, you will practice with articles, essays, and informational texts similar to those used in the exam. The writing section provides model essays at different score levels so you can understand what evaluators look for. Listening exercises feature recordings from various Spanish-speaking countries at the speed and complexity level of the real exam. The speaking section includes prompt cards with preparation notes and model responses.\n\nStart your preparation at least two months before the exam date. Take the first practice test as a diagnostic to identify your weakest section, then focus your study time accordingly. Complete the remaining practice tests under timed conditions in the final two weeks. The DELE B2 is a rigorous exam, but systematic preparation makes a significant difference in your score and confidence.",
      language: "spanish",
      proficiencyLevel: "B2" as const,
      resourceType: "WORKSHEET" as const,
      skillTags: ["READING" as const, "WRITING" as const, "LISTENING" as const, "SPEAKING" as const],
      contributorId: admin.id,
      embedUrl: "https://www.cervantes.es/lengua_y_ensenanza/certificados_espanol/dele/informacion_general.htm",
      thumbnailUrl: "https://picsum.photos/seed/dele-b2/640/360",
    },
    {
      title: "Spanish Irregular Verb Flashcards",
      description:
        "Master the 100 most common Spanish irregular verbs with this comprehensive flashcard deck. Irregular verbs are the bane of every Spanish learner's existence, but they are also among the most frequently used words in the language — mastering them transforms your fluency.\n\nEach card presents the infinitive form on the front, with the back showing full conjugation tables for present, preterite, imperfect, future, conditional, and present subjunctive tenses. Below the tables you will find three example sentences demonstrating the verb in natural contexts, memory aids linking the irregular pattern to similar verbs (for example, tener-venir-poner all share the same preterite pattern), and common idiomatic expressions using the verb.\n\nStart with the 20 most essential irregular verbs (ser, estar, ir, tener, hacer, poder, querer, saber, decir, venir, dar, ver, poner, salir, traer, and five more) before expanding to the full deck. Focus on one tense at a time — master present irregulars before moving to preterite, and so on. Review daily using spaced repetition for maximum retention.",
      language: "spanish",
      proficiencyLevel: "A2" as const,
      resourceType: "FLASHCARD_DECK" as const,
      skillTags: ["GRAMMAR" as const, "VOCABULARY" as const],
      contributorId: carlosM.id,
      embedUrl: "https://ankiweb.net/shared/info/638411706",
      thumbnailUrl: "https://picsum.photos/seed/spanish-irregular/640/360",
    },
    {
      title: "Advanced Spanish: El País Article Analysis",
      description:
        "A curated collection of 25 articles from El País, Spain's most widely-read newspaper, selected and annotated for advanced Spanish learners. Each article represents a different journalistic genre — news reporting, opinion columns, cultural reviews, investigative features, and interviews — giving you exposure to the full range of formal written Spanish.\n\nEvery article is accompanied by vocabulary annotations for journalistic and domain-specific terminology, cultural context notes explaining references that a non-Spanish reader might miss, analysis of rhetorical techniques and argumentation strategies used by the journalist, and five discussion questions that push you beyond comprehension into critical analysis and personal response.\n\nReading quality journalism is one of the most effective ways to develop advanced language skills. The articles expose you to sophisticated grammar (extended subjunctive usage, complex relative clauses, passive constructions), formal register vocabulary, and the cultural knowledge that underlies fluent communication. Read one article per week, annotate it thoroughly, and try to summarize the main argument in your own words. This resource is particularly valuable for learners preparing for the DELE C1 examination.",
      language: "spanish",
      proficiencyLevel: "C1" as const,
      resourceType: "ARTICLE" as const,
      skillTags: ["READING" as const, "VOCABULARY" as const],
      contributorId: admin.id,
      embedUrl: "https://elpais.com/",
      thumbnailUrl: "https://picsum.photos/seed/el-pais/640/360",
    },

    // ─── Korean (3) ───
    {
      title: "Talk To Me In Korean Level 1",
      description:
        "The most popular Korean textbook series for self-study learners worldwide. Talk To Me In Korean takes a conversational approach, teaching you practical Korean phrases and grammar from the very first lesson rather than spending weeks on theory before you can say anything useful.\n\nLevel 1 covers 25 lessons starting with basic greetings and the Korean number systems, then progressing through essential grammar particles (은/는, 이/가, 을/를), verb conjugation in present and past tense, making questions, expressing wants and needs, location words, and telling time and dates. Each lesson includes clear grammar explanations in English, natural dialogue examples, practice exercises, and cultural notes about when and how to use formal versus informal speech levels.\n\nThe TTMIK approach prioritizes getting you speaking quickly. Grammar explanations are concise and jargon-free, and every concept is immediately practiced in realistic contexts. The companion audio (available free on their website and podcast) features native speakers demonstrating natural pronunciation and intonation. Most self-study learners complete Level 1 in two to three months, after which you will be able to handle basic Korean conversations with confidence.",
      language: "korean",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "SPEAKING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://talktomeinkorean.com/curriculum/level-1/",
      thumbnailUrl: "https://picsum.photos/seed/ttmik-level1/640/360",
    },
    {
      title: "Korean Listening Practice: K-Drama Clips",
      description:
        "A carefully curated collection of 40 short clips from popular Korean dramas, selected and edited for language learning purposes. Each clip is two to five minutes long and features natural conversational Korean in relatable everyday situations — ordering coffee, meeting someone new, arguing with a friend, confessing feelings, navigating work relationships.\n\nEvery clip comes with Korean subtitles, English subtitles, a vocabulary list highlighting useful colloquial expressions, grammar notes explaining speech levels and sentence endings used in the dialogue, and cultural context about the social dynamics at play. Clips are organized by difficulty — easier clips feature slow, clear dialogue between two speakers, while advanced clips include rapid group conversations, mumbled speech, and heavy use of slang.\n\nK-dramas are an incredible resource for Korean learners because they model natural emotional expression and social dynamics that textbooks rarely capture. Watch each clip three times: first with English subtitles to understand the scene, then with Korean subtitles to connect sound to text, and finally without subtitles to test your comprehension. Try shadowing memorable lines to practice intonation and emotional expression.",
      language: "korean",
      proficiencyLevel: "A2" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const, "VOCABULARY" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.youtube.com/watch?v=i_hJbODgBjs",
      thumbnailUrl: "https://picsum.photos/seed/kdrama-clips/640/360",
    },
    {
      title: "TOPIK I Vocabulary Flashcards",
      description:
        "A complete flashcard deck covering the approximately 1,500 vocabulary words tested on the TOPIK I examination (levels 1 and 2). Organized thematically to support contextual learning rather than rote alphabetical memorization.\n\nThe deck is divided into 30 thematic modules: family and relationships, food and dining, shopping and money, weather and seasons, health and body, school and education, work and occupations, hobbies and sports, travel and transportation, and twenty more everyday categories. Each card includes the Korean word in Hangul, romanization for pronunciation reference, English meaning, an example sentence, and audio pronunciation by a native speaker. Cards are tagged by TOPIK level (1 or 2) so you can focus your study on your target exam level.\n\nStudy 20 new cards daily while reviewing due cards through spaced repetition. The thematic organization means you build vocabulary in meaningful clusters — learning all food-related words together, for example, creates stronger memory networks than learning random unrelated words. This deck pairs perfectly with TOPIK practice tests to verify that your vocabulary study is translating into exam readiness.",
      language: "korean",
      proficiencyLevel: "A2" as const,
      resourceType: "FLASHCARD_DECK" as const,
      skillTags: ["VOCABULARY" as const, "READING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://ankiweb.net/shared/info/4066961604",
      thumbnailUrl: "https://picsum.photos/seed/topik-vocab/640/360",
    },

    // ─── Chinese (3) ───
    {
      title: "Integrated Chinese Level 1",
      description:
        "The most widely adopted Chinese language textbook in North American universities, now in its fourth edition. Integrated Chinese takes a balanced approach covering all four skills — listening, speaking, reading, and writing — with a strong emphasis on practical communication in modern Chinese.\n\nLevel 1 consists of 10 lessons covering essential topics: greetings and introductions, family, dates and time, hobbies, visiting friends, making appointments, studying Chinese, school life, shopping, and transportation. Each lesson introduces 30 to 40 new vocabulary words, key grammar patterns with clear English explanations and abundant examples, a dialogue and a narrative passage, pronunciation practice, and character writing exercises with stroke order guides. The textbook teaches both simplified and traditional characters.\n\nIntegrated Chinese works best when you engage with all components — the textbook for grammar and reading, the workbook for writing practice, and the companion audio for listening and pronunciation. Character learning is the biggest challenge for most learners; dedicate a separate daily study session to writing and reviewing characters. Most classroom courses complete Level 1 in one academic year, but motivated self-study learners often finish in six to eight months.",
      language: "chinese",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "WRITING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://cheng-tsui.com/browse/chinese/integrated-chinese-level-1-part-1-4th-ed",
      thumbnailUrl: "https://picsum.photos/seed/integrated-chinese/640/360",
    },
    {
      title: "ChinesePod: Elementary Lessons",
      description:
        "A curated selection of 50 elementary-level lessons from ChinesePod, one of the longest-running and most respected Chinese language podcasts. Each lesson centers on a natural dialogue between native speakers, with detailed breakdowns of vocabulary, grammar, and cultural context.\n\nLessons cover practical everyday scenarios: checking into a hotel, ordering at a restaurant, haggling at a market, taking a taxi, seeing a doctor, making small talk with neighbors, and more. Each 15 to 20 minute episode features the dialogue performed at natural speed, a word-by-word breakdown at slow speed, grammar explanations relating to structures used in the dialogue, and cultural tips about appropriate behavior in each situation. Accompanying PDFs provide full transcripts in characters, pinyin, and English.\n\nChinesePod excels at teaching practical, usable Chinese through engaging content. The hosts are entertaining and the dialogues feel genuine rather than stilted. Listen to one lesson per day during your commute — first pass for general understanding, second pass with the transcript to catch details. The elementary level assumes you know basic pinyin and can read some characters, making it an ideal supplement to a textbook like Integrated Chinese.",
      language: "chinese",
      proficiencyLevel: "A2" as const,
      resourceType: "AUDIO" as const,
      skillTags: ["LISTENING" as const, "VOCABULARY" as const, "SPEAKING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://chinesepod.com/",
      thumbnailUrl: "https://picsum.photos/seed/chinesepod/640/360",
    },
    {
      title: "HSK 3 Reading Practice",
      description:
        "A collection of 20 graded reading passages designed for learners preparing for the HSK 3 examination or anyone at the lower-intermediate Chinese level. Each passage uses only vocabulary and grammar structures within the HSK 3 syllabus, providing challenging but achievable reading practice.\n\nPassages cover a variety of genres and topics: personal narratives about travel and family, informational texts about Chinese festivals and customs, short fiction stories, letters and emails, and practical texts like schedules, menus, and advertisements. Each passage is 200 to 400 characters long and comes with pinyin annotations for less common characters, vocabulary lists organized by HSK level, comprehension questions in multiple-choice and short-answer formats, and an answer key with explanations.\n\nReading in Chinese requires a different approach than alphabetic languages — you cannot sound out unfamiliar words, so building character recognition through extensive reading is essential. Start with the shorter, simpler passages and work up to the longer ones. Time yourself and track your reading speed over weeks — you should see gradual improvement. After completing this collection, you will be well-prepared for the reading section of the HSK 3 exam and ready to attempt authentic Chinese texts with dictionary support.",
      language: "chinese",
      proficiencyLevel: "B1" as const,
      resourceType: "GRADED_READER" as const,
      skillTags: ["READING" as const, "VOCABULARY" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.hsk.academy/en/hsk-3",
      thumbnailUrl: "https://picsum.photos/seed/hsk3-reading/640/360",
    },

    // ─── German (4) ───
    {
      title: "Menschen A1: German for Beginners",
      description:
        "One of the most popular German textbooks worldwide, used extensively in Goethe-Institut courses and language schools across Europe. Menschen takes a human-centered approach — every lesson opens with a real person's story, photo, or video that makes the grammar and vocabulary feel personally relevant.\n\nThe A1 level covers 24 short modules organized into eight thematic blocks: meeting people, at home, daily life, free time, food and drink, work, on the go, and celebrations. Each module introduces a manageable amount of new material — typically one grammar point and 15 to 20 vocabulary words — with immediate practice through partner activities, listening exercises, and short writing tasks. The textbook makes extensive use of images and realia (photos of real signs, tickets, menus, and forms from Germany, Austria, and Switzerland).\n\nMenschen's greatest strength is its gentle pacing and human touch. Each grammar point is introduced through a story or situation that makes the rule intuitive before it is formally explained. The companion workbook provides additional practice, and the online platform includes interactive exercises and pronunciation training. Most learners complete A1 in three to four months of regular study.",
      language: "german",
      proficiencyLevel: "A1" as const,
      resourceType: "TEXTBOOK" as const,
      skillTags: ["READING" as const, "GRAMMAR" as const, "VOCABULARY" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.hueber.de/menschen",
      thumbnailUrl: "https://picsum.photos/seed/menschen-a1/640/360",
    },
    {
      title: "Easy German Street Interviews",
      description:
        "A beloved YouTube series that brings German to life through unscripted street interviews with real people in cities across Germany. The Easy German team asks passers-by about their opinions, experiences, and daily lives, capturing the authentic diversity of spoken German.\n\nThe series features hundreds of videos organized by topic and difficulty. Popular themes include: What makes you happy? What is your daily routine? What do you think about German stereotypes? What is your favorite German word? Each video runs five to fifteen minutes and includes dual German/English subtitles. The interviewees span all ages, backgrounds, and German regions, exposing you to natural speech variation — dialects, speed, filler words, and colloquialisms that textbooks never teach.\n\nEasy German is a perfect complement to any structured course. The street interview format gives you exposure to how Germans actually speak in casual situations, which is dramatically different from textbook dialogues. Start with the Super Easy German series (slower, simpler topics) if you are at A1 level, then graduate to the regular series at A2 and above. Try watching without subtitles, then check your comprehension with them.",
      language: "german",
      proficiencyLevel: "A2" as const,
      resourceType: "VIDEO" as const,
      skillTags: ["LISTENING" as const, "SPEAKING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.youtube.com/watch?v=Ch9F4SsJrzU",
      thumbnailUrl: "https://picsum.photos/seed/easy-german/640/360",
    },
    {
      title: "Deutsche Welle: Langsam gesprochene Nachrichten",
      description:
        "A daily news broadcast from Deutsche Welle, Germany's international broadcaster, read at a deliberately slow pace for German learners. This is one of the most valuable free resources available for intermediate German listening and reading practice.\n\nEvery weekday, Deutsche Welle publishes a ten-minute news broadcast covering the top stories from Germany and around the world, read by professional newsreaders at approximately two-thirds of normal broadcast speed. Each broadcast comes with a full transcript that you can read along with or use for post-listening review. The vocabulary is authentic journalistic German — formal, precise, and rich with the compound nouns and passive constructions that characterize German news reporting.\n\nMake this part of your daily routine — listen every morning over breakfast or during your commute. At first, aim to catch the main topic of each news item. As your listening improves, challenge yourself to summarize each story in a sentence or two. When you can comfortably follow the slow version, switch to the regular-speed Deutsche Welle news to continue pushing your comprehension. This resource is particularly effective for building the formal register vocabulary tested in the Goethe B1 and B2 exams.",
      language: "german",
      proficiencyLevel: "B1" as const,
      resourceType: "ARTICLE" as const,
      skillTags: ["LISTENING" as const, "READING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.dw.com/de/langsam-gesprochene-nachrichten/s-8150",
      thumbnailUrl: "https://picsum.photos/seed/dw-nachrichten/640/360",
    },
    {
      title: "German B1 Grammar Worksheets",
      description:
        "A comprehensive collection of grammar worksheets targeting the structures tested at the B1 level of the Goethe-Zertifikat examination. Each worksheet focuses on a single grammar topic with clear explanations followed by progressive exercises.\n\nThe collection covers 15 key B1 grammar areas: Konjunktiv II (would/could), relative clauses with all relative pronouns, passive voice in present and past tenses, indirect speech, double connectors (nicht nur...sondern auch, je...desto), prepositions with Genitiv, Plusquamperfekt, future tense with werden, infinitive clauses with zu, reflexive verbs with changing meaning, adjective declension review, n-Deklination, word order in complex sentences, indirect questions, and temporal clauses with nachdem/bevor/während.\n\nEach topic includes a one-page explanation with examples, two pages of exercises progressing from controlled practice to free production, and a full answer key. Work through one topic per study session, checking your answers carefully and noting any patterns in your errors. These worksheets are designed to complement any B1 textbook and are particularly useful for exam preparation, where grammar accuracy is heavily weighted in the writing and speaking sections.",
      language: "german",
      proficiencyLevel: "B1" as const,
      resourceType: "WORKSHEET" as const,
      skillTags: ["GRAMMAR" as const, "WRITING" as const],
      contributorId: priyaS.id,
      embedUrl: "https://www.goethe.de/de/spr/ueb/stu.html",
      thumbnailUrl: "https://picsum.photos/seed/german-grammar/640/360",
    },
  ];

  const resources = [];
  for (const data of resourcesData) {
    const resource = await prisma.resource.create({
      data: {
        ...data,
        content: resourceContent[data.title] ?? null,
        status: "APPROVED",
        avgRating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 20) + 1,
        downloadCount: Math.floor(Math.random() * 500) + 10,
      },
    });
    resources.push(resource);
  }

  console.log(`Created ${resources.length} resources`);

  // ── Collections ────────────────────────────────────────────────────────────
  await prisma.collection.create({
    data: {
      title: "Complete Japanese Beginner Path",
      description:
        "Everything you need to go from zero to conversational Japanese. Start with Genki I and work your way through these carefully ordered resources.",
      language: "japanese",
      creatorId: yukiT.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "japanese")
          .slice(0, 5)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "French B1 Study Plan",
      description:
        "Curated resources to reach intermediate French proficiency. Focuses on reading, listening, and grammar with a mix of textbook study and authentic content.",
      language: "french",
      creatorId: marieD.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "french")
          .slice(0, 4)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "Spanish for Travel",
      description:
        "Essential Spanish resources for travelers. Learn practical vocabulary, conversational skills, and cultural awareness to navigate the Spanish-speaking world with confidence.",
      language: "spanish",
      creatorId: carlosM.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "spanish")
          .slice(0, 4)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "DELE B2 Exam Prep",
      description:
        "All the resources you need to prepare for and pass the DELE B2 Spanish exam. Covers reading, writing, listening, and speaking practice.",
      language: "spanish",
      creatorId: admin.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter(
            (r) =>
              r.language === "spanish" &&
              ["B1", "B2"].includes(r.proficiencyLevel)
          )
          .slice(0, 3)
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "Korean for K-Drama Fans",
      description:
        "Learn Korean through the language of your favorite dramas. This collection combines structured textbook study with authentic K-drama listening practice and exam-focused vocabulary building.",
      language: "korean",
      creatorId: priyaS.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "korean")
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "German A1-B1 Study Path",
      description:
        "A structured path from absolute beginner to intermediate German. Start with Menschen A1, build listening skills with Easy German, and solidify grammar with targeted worksheets.",
      language: "german",
      creatorId: priyaS.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "german")
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  await prisma.collection.create({
    data: {
      title: "Mandarin Chinese Starter Kit",
      description:
        "Everything you need to begin your Chinese learning journey. Covers textbook fundamentals, listening practice, and reading development from A1 to B1.",
      language: "chinese",
      creatorId: priyaS.id,
      visibility: "PUBLIC",
      items: {
        create: resources
          .filter((r) => r.language === "chinese")
          .map((r, i) => ({ resourceId: r.id, sortOrder: i })),
      },
    },
  });

  console.log("Created collections");

  // ── Reviews ────────────────────────────────────────────────────────────────
  const reviewData = [
    // Japanese
    { resourceIdx: 0, userId: learner.id, rating: 5, comment: "The best Japanese textbook for beginners, hands down. The progression is perfect and the exercises are really helpful. I went from knowing nothing to passing JLPT N5 after six months with this book." },
    { resourceIdx: 0, userId: jordanK.id, rating: 4, comment: "Great textbook but the pace can be fast for self-study. Works best with a teacher or study group. The dialogues feel a bit dated but the grammar explanations are excellent." },
    { resourceIdx: 1, userId: learner.id, rating: 4, comment: "Solid continuation of Genki I. The grammar gets noticeably harder but the format stays consistent. Honorific language chapter was tough but necessary." },
    { resourceIdx: 2, userId: learner.id, rating: 5, comment: "I read NHK News Easy every morning with my coffee. The furigana and vocabulary lists make it accessible even at my level. Best free Japanese resource on the internet." },
    { resourceIdx: 2, userId: marieD.id, rating: 4, comment: "Excellent free resource. The audio recordings are clear and the articles are genuinely interesting. Updated daily which keeps you coming back." },
    { resourceIdx: 3, userId: jordanK.id, rating: 4, comment: "The three-speed approach is genius. I started with slow speed and now I can follow the normal speed conversations. Great for commute listening." },
    { resourceIdx: 4, userId: admin.id, rating: 5, comment: "Tobira transformed my Japanese. The jump from Genki is real but the authentic materials make it worth the struggle. Reading real newspaper excerpts felt amazing." },
    { resourceIdx: 5, userId: learner.id, rating: 4, comment: "Well-organized deck with good mnemonics. The example compounds for each kanji are especially useful. I wish it included more stroke order animations." },
    { resourceIdx: 6, userId: jordanK.id, rating: 5, comment: "These graded readers gave me confidence I never got from textbooks. Actually finishing a whole story in Japanese felt incredible, even a simple one." },
    { resourceIdx: 7, userId: learner.id, rating: 4, comment: "Shadowing is hard at first but stick with it. After three weeks I noticed a real difference in how naturally Japanese came out when speaking." },

    // French
    { resourceIdx: 8, userId: learner.id, rating: 5, comment: "French in Action is amazing! The immersive approach really works. The story of Robert and Mireille keeps you watching even when the grammar gets complex." },
    { resourceIdx: 8, userId: jordanK.id, rating: 4, comment: "A classic for a reason. The production quality is dated but the teaching methodology is timeless. I watched one episode every evening for two months." },
    { resourceIdx: 9, userId: learner.id, rating: 4, comment: "Solid textbook with good exercises. The cultural notes add nice context and the authentic documents make lessons feel relevant." },
    { resourceIdx: 10, userId: carlosM.id, rating: 5, comment: "Finally fixed my French pronunciation after years of bad habits. The nasal vowels module alone was worth it. Clear demonstrations and great practice exercises." },
    { resourceIdx: 11, userId: admin.id, rating: 5, comment: "Beautiful adaptation of a beloved classic. The vocabulary annotations are perfectly placed and the comprehension questions really test understanding." },
    { resourceIdx: 12, userId: learner.id, rating: 4, comment: "These drills really helped me master the subjunctive. The progressive difficulty is well thought out and the answer key explanations are thorough." },
    { resourceIdx: 13, userId: yukiT.id, rating: 4, comment: "Challenging but that is the point at C1 level. The France Inter segments are fascinating and the transcripts are essential for catching rapid speech." },
    { resourceIdx: 14, userId: jordanK.id, rating: 5, comment: "Exactly the vocabulary deck I needed for DELF B1 prep. Thematic organization makes so much more sense than alphabetical. Great example sentences." },

    // Spanish
    { resourceIdx: 15, userId: learner.id, rating: 4, comment: "These drills really helped me master the conjugations. The progressive difficulty is well thought out. I finally stopped confusing preterite and imperfect." },
    { resourceIdx: 16, userId: marieD.id, rating: 5, comment: "The communicative approach in this textbook is excellent. Feels like you are learning to actually use the language, not just memorize rules." },
    { resourceIdx: 17, userId: jordanK.id, rating: 4, comment: "Love the natural feel of Ben and Marina's conversations. You pick up so much colloquial Spanish that textbooks never teach. Perfect for commute listening." },
    { resourceIdx: 18, userId: learner.id, rating: 5, comment: "So fun to watch! Real conversations with real people. The subtitles help a lot and hearing different accents from different countries is invaluable." },
    { resourceIdx: 19, userId: admin.id, rating: 4, comment: "Engaging stories with just the right level of challenge. The mystery set in Andalusia was my favorite. Great for building reading fluency and confidence." },
    { resourceIdx: 20, userId: yukiT.id, rating: 4, comment: "Well-structured prompts that push you to produce Spanish actively. The model responses are helpful for seeing different ways to express the same idea." },
    { resourceIdx: 21, userId: learner.id, rating: 5, comment: "Love this show! Each episode builds on the last and the mystery keeps you motivated to continue. Watched all 52 episodes and my Spanish improved dramatically." },
    { resourceIdx: 22, userId: jordanK.id, rating: 5, comment: "Comprehensive and well-structured exam prep. The practice tests are realistic and the strategy guides for each section are invaluable. Passed DELE B2 on my first try." },
    { resourceIdx: 23, userId: learner.id, rating: 4, comment: "The memory aids linking irregular patterns together were a game changer. Instead of memorizing each verb individually, you start seeing the system." },
    { resourceIdx: 24, userId: carlosM.id, rating: 5, comment: "Reading real journalism is the best way to level up. The annotations make El País articles accessible and the discussion questions push critical thinking." },

    // Korean
    { resourceIdx: 25, userId: jordanK.id, rating: 5, comment: "TTMIK got me speaking Korean faster than any other resource. The explanations are so clear and the podcast format makes studying feel effortless." },
    { resourceIdx: 25, userId: learner.id, rating: 4, comment: "Great for self-study. The conversational approach means you learn useful phrases from day one instead of spending weeks on theory." },
    { resourceIdx: 26, userId: jordanK.id, rating: 5, comment: "As a K-drama addict, this is a dream resource. Hearing grammar I learned in TTMIK used in real drama scenes made everything click. The cultural notes are a nice bonus." },
    { resourceIdx: 27, userId: learner.id, rating: 4, comment: "Well-organized vocabulary deck. The thematic grouping makes review sessions feel purposeful. Good preparation for TOPIK I." },

    // Chinese
    { resourceIdx: 28, userId: jordanK.id, rating: 4, comment: "The standard Chinese textbook for good reason. Covers all four skills thoroughly. Character learning is tough but the stroke order guides help." },
    { resourceIdx: 29, userId: learner.id, rating: 5, comment: "ChinesePod makes learning Chinese actually fun. The hosts are entertaining and the dialogues feel like real conversations, not textbook scripts." },
    { resourceIdx: 30, userId: jordanK.id, rating: 4, comment: "Good reading practice at just the right difficulty level. The variety of text types keeps it interesting. Pinyin annotations are helpful for less common characters." },

    // German
    { resourceIdx: 31, userId: learner.id, rating: 5, comment: "Menschen is my favorite German textbook. Every lesson starts with a real person's story which makes the grammar feel meaningful and memorable." },
    { resourceIdx: 32, userId: jordanK.id, rating: 5, comment: "Easy German is pure gold. Hearing real Germans talk about their lives taught me more about natural German than any textbook. The subtitles are essential." },
    { resourceIdx: 32, userId: yukiT.id, rating: 4, comment: "Fun and educational. The street interview format keeps things fresh and you get exposed to different regional accents naturally." },
    { resourceIdx: 33, userId: learner.id, rating: 4, comment: "DW slow news is my daily German habit. The slow pace makes it accessible and the topics keep me informed about German current events. Brilliant concept." },
    { resourceIdx: 34, userId: jordanK.id, rating: 4, comment: "Thorough grammar worksheets with clear explanations. The progressive exercises really help internalize each grammar point. Useful for Goethe B1 prep." },
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
  const uniqueIndices = Array.from(
    new Set(reviewData.map((r) => r.resourceIdx))
  );
  for (const idx of uniqueIndices) {
    const agg = await prisma.review.aggregate({
      where: { resourceId: resources[idx].id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.resource.update({
      where: { id: resources[idx].id },
      data: {
        avgRating: agg._avg.rating || 0,
        ratingCount: agg._count.rating,
      },
    });
  }

  console.log("Created reviews");

  // ── Media Links ────────────────────────────────────────────────────────────
  const mediaLinksData = [
    // Japanese
    { title: "Japanese Ammo with Misa", url: "https://www.youtube.com/c/JapaneseAmmowithMisa", platform: "YOUTUBE" as const, language: "japanese", proficiencyLevel: "A2" as const, submittedById: yukiT.id },
    { title: "Nihongo con Teppei (Beginner)", url: "https://nihongoconteppei.com/", platform: "PODCAST" as const, language: "japanese", proficiencyLevel: "A2" as const, submittedById: admin.id },
    { title: "NHK World Japan", url: "https://www3.nhk.or.jp/nhkworld/", platform: "NEWS" as const, language: "japanese", proficiencyLevel: "B2" as const, submittedById: yukiT.id },
    // French
    { title: "InnerFrench Podcast", url: "https://innerfrench.com/podcast/", platform: "PODCAST" as const, language: "french", proficiencyLevel: "B1" as const, submittedById: marieD.id },
    { title: "Français avec Pierre", url: "https://www.youtube.com/c/FrancaisavecPierre", platform: "YOUTUBE" as const, language: "french", proficiencyLevel: "A2" as const, submittedById: marieD.id },
    { title: "Journal en français facile", url: "https://savoirs.rfi.fr/fr/apprendre-enseigner/langue-francaise/journal-en-francais-facile", platform: "NEWS" as const, language: "french", proficiencyLevel: "B1" as const, submittedById: admin.id },
    // Spanish
    { title: "Dreaming Spanish", url: "https://www.youtube.com/c/DreamingSpanish", platform: "YOUTUBE" as const, language: "spanish", proficiencyLevel: "A1" as const, submittedById: carlosM.id },
    { title: "Coffee Break Spanish", url: "https://coffeebreaklanguages.com/coffeebreakspanish/", platform: "PODCAST" as const, language: "spanish", proficiencyLevel: "A2" as const, submittedById: admin.id },
    // Korean
    { title: "Talk To Me In Korean", url: "https://www.youtube.com/c/TalkToMeInKorean", platform: "YOUTUBE" as const, language: "korean", proficiencyLevel: "A1" as const, submittedById: priyaS.id },
    { title: "Korean Unnie", url: "https://www.youtube.com/c/KoreanUnnie", platform: "YOUTUBE" as const, language: "korean", proficiencyLevel: "A2" as const, submittedById: priyaS.id },
    // German
    { title: "Easy German", url: "https://www.youtube.com/c/EasyGerman", platform: "YOUTUBE" as const, language: "german", proficiencyLevel: "A2" as const, submittedById: priyaS.id },
    { title: "Slow German mit Annik Rubens", url: "https://slowgerman.com/", platform: "PODCAST" as const, language: "german", proficiencyLevel: "B1" as const, submittedById: priyaS.id },
    // Chinese
    { title: "Mandarin Corner", url: "https://www.youtube.com/c/MandarinCorner", platform: "YOUTUBE" as const, language: "chinese", proficiencyLevel: "A2" as const, submittedById: priyaS.id },
    { title: "ChinesePod", url: "https://chinesepod.com/", platform: "PODCAST" as const, language: "chinese", proficiencyLevel: "A2" as const, submittedById: priyaS.id },
    { title: "The Chairman's Bao", url: "https://www.thechairmansbao.com/", platform: "NEWS" as const, language: "chinese", proficiencyLevel: "B1" as const, submittedById: priyaS.id },
  ];

  for (const ml of mediaLinksData) {
    await prisma.mediaLink.create({
      data: { ...ml, upvotes: Math.floor(Math.random() * 50) + 5 },
    });
  }

  console.log("Created media links");

  // ── Bookmarks ──────────────────────────────────────────────────────────────
  await prisma.bookmark.createMany({
    data: [
      // Alex Rivera (learner)
      { userId: learner.id, resourceId: resources[0].id, status: "IN_PROGRESS" },
      { userId: learner.id, resourceId: resources[2].id, status: "TO_STUDY" },
      { userId: learner.id, resourceId: resources[5].id, status: "TO_STUDY" },
      { userId: learner.id, resourceId: resources[8].id, status: "COMPLETED" },
      // Jordan Kim (learner2)
      { userId: jordanK.id, resourceId: resources[25].id, status: "IN_PROGRESS" },
      { userId: jordanK.id, resourceId: resources[26].id, status: "IN_PROGRESS" },
      { userId: jordanK.id, resourceId: resources[27].id, status: "TO_STUDY" },
      { userId: jordanK.id, resourceId: resources[31].id, status: "TO_STUDY" },
      { userId: jordanK.id, resourceId: resources[32].id, status: "IN_PROGRESS" },
      { userId: jordanK.id, resourceId: resources[0].id, status: "COMPLETED" },
      { userId: jordanK.id, resourceId: resources[16].id, status: "COMPLETED" },
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
