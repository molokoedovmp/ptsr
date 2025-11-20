export type AnxietyTestQuestion = {
  id: string
  text: string
  options: { label: string; value: number }[]
}

export type AnxietySeverityLevel = {
  label: string
  description: string
  min: number
  max: number
}

export type AnxietyTestDefinition = {
  slug: string
  title: string
  subtitle: string
  duration: string
  questionsCount: number
  description: string
  footnote: string
  availabilityNote?: string
  reliability?: string
  application?: string
  questions: AnxietyTestQuestion[]
  severityLevels: AnxietySeverityLevel[]
  scaleLabel: string
  maxOptionValue: number
}

const baseOptions = [
  { label: 'Никогда', value: 0 },
  { label: 'Несколько дней', value: 1 },
  { label: 'Более половины дней', value: 2 },
  { label: 'Почти каждый день', value: 3 },
]

const baiOptions = [
  { label: 'Совсем нет', value: 0 },
  { label: 'Легко, не сильно', value: 1 },
  { label: 'Умеренно, неприятно', value: 2 },
  { label: 'Сильно, очень тревожно', value: 3 },
]

const harsOptions = [
  { label: 'Отсутствует', value: 0 },
  { label: 'Легкое', value: 1 },
  { label: 'Умеренное', value: 2 },
  { label: 'Выраженное', value: 3 },
  { label: 'Тяжёлое', value: 4 },
]

const staiStateOptions = [
  { label: 'Совсем нет', value: 1 },
  { label: 'Немного', value: 2 },
  { label: 'Умеренно', value: 3 },
  { label: 'Очень сильно', value: 4 },
]

const staiTraitOptions = [
  { label: 'Почти никогда', value: 1 },
  { label: 'Иногда', value: 2 },
  { label: 'Часто', value: 3 },
  { label: 'Почти всегда', value: 4 },
]

const gad7Questions: AnxietyTestQuestion[] = [
  'Чувствовали нервозность, тревогу или напряжённость?',
  'Не могли остановить или контролировать беспокойство?',
  'Чрезмерно беспокоились о разных вещах?',
  'Испытывали трудности, чтобы расслабиться?',
  'Были настолько беспокойны, что вам было трудно усидеть на месте?',
  'Чувствовали раздражительность или легко раздражались?',
  'Чувствовали страх, что может случиться что-то ужасное?',
].map((text, index) => ({
  id: `gad7-q${index + 1}`,
  text,
  options: baseOptions,
}))

const baiQuestions: AnxietyTestQuestion[] = [
  'Ощущение онемения или покалывания',
  'Чувство прилива жара',
  'Слабость в ногах',
  'Трудности с расслаблением',
  'Страх, что случится самое плохое',
  'Ощущение головокружения или лёгкости в голове',
  'Учащённое сердцебиение',
  'Плохое равновесие',
  'Страх потери контроля',
  'Ощущение дрожи',
  'Трудности с дыханием',
  'Страх смерти',
  'Испуг',
  'Нервозность',
  'Ощущение удушья',
  'Дрожь в руках',
  'Ощущение неустойчивости',
  'Страх', 
  'Сердцебиение',
  'Потливость',
  'Чувство дискомфорта в животе',
].map((text, index) => ({
  id: `bai-q${index + 1}`,
  text,
  options: baiOptions,
}))

const harsQuestions: AnxietyTestQuestion[] = [
  'Чувство напряжения, обеспокоенности',
  'Чувство страха',
  'Беспокойство',
  'Бессонница',
  'Количество жалоб со стороны памяти/концентрации',
  'Ощущение грусти',
  'Соматические мышечные симптомы',
  'Соматические сенсорные симптомы',
  'Сердечно-сосудистые симптомы',
  'Респираторные симптомы',
  'Желудочно-кишечные симптомы',
  'Генито-уринарные симптомы',
  'Автономные симптомы',
  'Поведение в интервью',
].map((text, index) => ({
  id: `hars-q${index + 1}`,
  text,
  options: harsOptions,
}))

const staiStateQuestions = [
  'Я напряжён',
  'Мне ничто не угрожает',
  'Я нахожусь в напряжении',
  'Я испытываю чувство лёгкости',
  'Мне бывает грустно',
  'Я доволен',
  'Меня охватывает тревога',
  'Я чувствую себя спокойно',
  'Мне не хватает уверенности',
  'Я спокоен',
  'Меня волнуют возможные трудности',
  'Я ощущаю внутреннее спокойствие',
  'Я чувствую прилив сил',
  'Меня пугают трудности',
  'Я счастлив',
  'Я испытываю усталость',
  'Я спокоен',
  'Я чувствую себя связанным по рукам',
  'Я готов действовать',
  'Я уверен в себе',
]
const staiTraitQuestions = [
  'Я легко расстраиваюсь',
  'Я люблю быть в центре событий',
  'Я часто теряю терпение',
  'Я чувствую себя счастливым человеком',
  'Я часто чувствую себя одиноким',
  'Я легко принимаю решения',
  'Я сомневаюсь в себе',
  'Я чувствую себя оптимистично',
  'Я быстро утомляюсь',
  'Я уверен в завтрашнем дне',
  'Я удовлетворён своей жизнью',
  'Я часто нервничаю без причины',
  'Я чувствую себя сильным человеком',
  'Я переживаю из-за пустяков',
  'Я защищён',
  'Я легко справляюсь со стрессом',
  'Я часто беспокоюсь о будущем',
  'Я миролюбив',
  'Я ощущаю давление обстоятельств',
  'Я доволен собой',
]

const staiQuestions: AnxietyTestQuestion[] = [
  ...staiStateQuestions.map((text, index) => ({
    id: `stai-state-${index + 1}`,
    text,
    options: staiStateOptions,
  })),
  ...staiTraitQuestions.map((text, index) => ({
    id: `stai-trait-${index + 1}`,
    text,
    options: staiTraitOptions,
  })),
]

export const anxietyTests: AnxietyTestDefinition[] = [
  {
    slug: 'gad-7',
    title: 'GAD-7',
    subtitle: 'Шкала генерализованного тревожного расстройства',
    duration: '2-3 мин',
    questionsCount: 7,
    description:
      'Стандартизированный скрининг-инструмент, созданный в 2006 году Spitzer R.L., Kroenke K., Williams J.B., Löwe B. для оценки уровня генерализованного тревожного расстройства (ГТР).',
    footnote: 'Инструмент находится в свободном доступе для некоммерческого использования и научных исследований.',
    questions: gad7Questions,
    severityLevels: [
      { label: 'Минимальная тревога', description: '0–4 балла — симптомов практически нет', min: 0, max: 4 },
      { label: 'Лёгкая тревога', description: '5–9 баллов — рекомендуется наблюдение и самопомощь', min: 5, max: 9 },
      { label: 'Умеренная тревога', description: '10–14 баллов — стоит обсудить состояние с психологом', min: 10, max: 14 },
      { label: 'Выраженная тревога', description: '15–21 балл — рекомендуется профессиональная помощь', min: 15, max: 21 },
    ],
    scaleLabel: 'Частота симптомов за последние 2 недели',
    maxOptionValue: 3,
    availabilityNote: '7 вопросов',
  },
  {
    slug: 'bai',
    title: 'BAI',
    subtitle: 'Инвентарь тревожности Бека',
    duration: '5-7 мин',
    questionsCount: 21,
    description:
      'Измеряет соматические симптомы тревоги. Разработан Аароном Беком и коллегами в 1988 году. Позволяет различать тревогу и депрессию и выявлять панические атаки.',
    footnote: 'Тест представлен в адаптированной форме для образовательных целей.',
    questions: baiQuestions,
    severityLevels: [
      { label: 'Минимальная тревога', description: '0–7 баллов', min: 0, max: 7 },
      { label: 'Лёгкая тревога', description: '8–15 баллов', min: 8, max: 15 },
      { label: 'Умеренная тревога', description: '16–25 баллов', min: 16, max: 25 },
      { label: 'Выраженная тревога', description: '26–63 балла', min: 26, max: 63 },
    ],
    scaleLabel: 'Насколько сильно вас беспокоил симптом за последнюю неделю',
    maxOptionValue: 3,
    availabilityNote: '21 вопрос',
  },
  {
    slug: 'hars',
    title: 'HARS',
    subtitle: 'Шкала тревоги Гамильтона',
    duration: '15-20 мин',
    questionsCount: 14,
    description:
      'Клиническая шкала, разработанная Максом Гамильтоном в 1959 году. Используется специалистами для оценки выраженности тревожных симптомов на основе интервью и наблюдения.',
    footnote: 'Инструмент предназначен для специалистов и представлен в ознакомительных целях.',
    questions: harsQuestions,
    severityLevels: [
      { label: 'Минимальная тревога', description: '0–17 баллов', min: 0, max: 17 },
      { label: 'Лёгкая тревога', description: '18–24 балла', min: 18, max: 24 },
      { label: 'Умеренная тревога', description: '25–30 баллов', min: 25, max: 30 },
      { label: 'Выраженная тревога', description: '31+ баллов', min: 31, max: 56 },
    ],
    scaleLabel: 'Интенсивность проявления симптома',
    maxOptionValue: 4,
    availabilityNote: '14 пунктов',
  },
  {
    slug: 'stai',
    title: 'STAI',
    subtitle: 'Опросник Спилбергера-Ханина',
    duration: '8-10 мин',
    questionsCount: 40,
    description:
      'Дифференцирует ситуативную и личностную тревожность. Разработан Чарльзом Спилбергером и коллегами в 1970 году, адаптирован Ю.Л. Ханиным. Золотой стандарт в психологической диагностике.',
    footnote: 'Русскоязычная адаптация представлена для образовательных целей.',
    questions: staiQuestions,
    severityLevels: [
      { label: 'Низкая тревожность', description: '20–30 баллов', min: 20, max: 30 },
      { label: 'Умеренная тревожность', description: '31–44 балла', min: 31, max: 44 },
      { label: 'Высокая тревожность', description: '45–80 баллов', min: 45, max: 80 },
    ],
    scaleLabel: 'Степень согласия с утверждением',
    maxOptionValue: 4,
    availabilityNote: '40 вопросов',
    reliability: 'Очень высокая',
    application: 'Психологическая диагностика',
  },
]

export const getAnxietyTestBySlug = (slug: string) => anxietyTests.find((test) => test.slug === slug)

