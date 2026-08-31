/**
 * Default Preset Quizzes Database
 * Rich, engaging questions with options, hints, explanations, category icons, and color themes.
 */

const PRESET_QUIZZES = [
  {
    id: 'quiz_web_dev',
    title: 'Web Tech & Code Masters',
    category: 'Technology',
    icon: 'fa-code',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#4f46e5',
    description: 'Test your mastery of JavaScript, HTML5, CSS3, DOM manipulation, and modern web architecture.',
    timePerQuestion: 20, // seconds
    difficulty: 'Medium',
    questions: [
      {
        id: 'q_web_1',
        question: 'Which JavaScript method creates a new array with all elements that pass a test implemented by the provided function?',
        options: ['map()', 'filter()', 'reduce()', 'forEach()'],
        correct: 1,
        hint: 'It sifts out items based on a boolean condition.',
        explanation: 'filter() creates a new array filled with elements that pass a test provided by a function without mutating the original array.'
      },
      {
        id: 'q_web_2',
        question: 'In CSS Grid Layout, which property defines the gap between grid columns and rows?',
        options: ['grid-margin', 'gap', 'grid-spacing', 'column-padding'],
        correct: 1,
        hint: 'A simple 3-letter CSS property used in Flexbox & Grid.',
        explanation: 'The `gap` property (or `grid-gap`) sets the gutters between rows and columns in grid and flexbox layouts.'
      },
      {
        id: 'q_web_3',
        question: 'What is the purpose of the `async` attribute on a `<script>` tag in HTML?',
        options: [
          'It executes the script synchronously before parsing HTML',
          'It fetches the script asynchronously and executes it as soon as it arrives',
          'It defers script execution until the DOM is fully loaded',
          'It runs the script in a Web Worker thread'
        ],
        correct: 1,
        hint: 'Unlike `defer`, it does not wait for HTML parsing to complete before executing.',
        explanation: 'The `async` attribute tells the browser to download the script in the background and execute it immediately when downloaded, without waiting for DOM parsing.'
      },
      {
        id: 'q_web_4',
        question: 'What will `typeof NaN` evaluate to in JavaScript?',
        options: ['"undefined"', '"number"', '"nan"', '"object"'],
        correct: 1,
        hint: 'Despite standing for "Not-a-Number", JavaScript categorizes it under a primitive type.',
        explanation: 'In JavaScript, `NaN` stands for "Not-a-Number", but its data type is actually `"number"` according to the ECMAScript standard.'
      },
      {
        id: 'q_web_5',
        question: 'Which HTTP status code signifies "201 Created"?',
        options: ['200', '201', '204', '301'],
        correct: 1,
        hint: 'It is in the 2xx success range, specifically indicating a resource creation success.',
        explanation: 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource.'
      }
    ]
  },
  {
    id: 'quiz_science_space',
    title: 'Cosmos, Physics & Tech',
    category: 'Science',
    icon: 'fa-user-astronaut',
    color: 'from-purple-500 to-pink-600',
    accentColor: '#d946ef',
    description: 'Explore fundamental physics, astrophysics, quantum phenomena, and modern technology breakthroughs.',
    timePerQuestion: 25,
    difficulty: 'Hard',
    questions: [
      {
        id: 'q_sci_1',
        question: 'What event horizon phenomenon allows particle pairs to escape a black hole, causing it to evaporate over time?',
        options: ['Hawking Radiation', 'Einstein-Rosen Bridge', 'Event Horizon Decay', 'Chandrasekhar Limit'],
        correct: 0,
        hint: 'Named after the theoretical physicist Stephen Hawking.',
        explanation: 'Hawking radiation is thermal radiation predicted to be emitted by black holes due to quantum effects near the event horizon.'
      },
      {
        id: 'q_sci_2',
        question: 'Which subatomic particle carries a negative electric charge and orbits the nucleus of an atom?',
        options: ['Proton', 'Neutron', 'Electron', 'Neutrino'],
        correct: 2,
        hint: 'It flows to create electrical currents.',
        explanation: 'Electrons are subatomic particles with a negative elementary electric charge.'
      },
      {
        id: 'q_sci_3',
        question: 'What is the speed of light in a vacuum (approximate in meters per second)?',
        options: ['300,000 m/s', '3,000,000 m/s', '300,000,000 m/s', '3,000,000,000 m/s'],
        correct: 2,
        hint: 'Represented as `c` in Einstein\'s E=mc².',
        explanation: 'The speed of light in vacuum is exactly 299,792,458 m/s, approximately 3 × 10⁸ m/s.'
      },
      {
        id: 'q_sci_4',
        question: 'Which gas makes up approximately 78% of Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
        correct: 2,
        hint: 'It is an essential component of amino acids and nucleic acids.',
        explanation: 'Nitrogen gas (N2) forms ~78.08% of Earth\'s atmosphere, far surpassing Oxygen (~21%).'
      },
      {
        id: 'q_sci_5',
        question: 'What is the closest planet to the Sun in our Solar System?',
        options: ['Venus', 'Mercury', 'Mars', 'Earth'],
        correct: 1,
        hint: 'It is the smallest planet in the solar system.',
        explanation: 'Mercury is the smallest and innermost planet in the Solar System, orbiting the Sun every 88 Earth days.'
      }
    ]
  },
  {
    id: 'quiz_pop_cinema',
    title: 'Pop Culture & Cinema',
    category: 'Entertainment',
    icon: 'fa-film',
    color: 'from-amber-500 to-red-600',
    accentColor: '#f59e0b',
    description: 'Test your knowledge on iconic movies, legendary music, television blockbusters, and pop trends.',
    timePerQuestion: 15,
    difficulty: 'Easy',
    questions: [
      {
        id: 'q_pop_1',
        question: 'Which 1994 film features the quote: "Life is like a box of chocolates"?',
        options: ['Pulp Fiction', 'Forrest Gump', 'The Shawshank Redemption', 'Good Will Hunting'],
        correct: 1,
        hint: 'Starring Tom Hanks as the titular character.',
        explanation: 'Tom Hanks famously delivered this line in *Forrest Gump*, which won six Academy Awards including Best Picture.'
      },
      {
        id: 'q_pop_2',
        question: 'Which superhero is known as the "Caped Crusader" of Gotham City?',
        options: ['Superman', 'Spider-Man', 'Batman', 'Iron Man'],
        correct: 2,
        hint: 'Billionaire Bruce Wayne by day.',
        explanation: 'Batman is widely dubbed the Caped Crusader, protecting Gotham City.'
      },
      {
        id: 'q_pop_3',
        question: 'Which animated movie was the highest-grossing film worldwide in 2013, featuring the song "Let It Go"?',
        options: ['Moana', 'Frozen', 'Tangled', 'Zootopia'],
        correct: 1,
        hint: 'Follows royal sisters Elsa and Anna.',
        explanation: 'Disney\'s *Frozen* took the world by storm in 2013 featuring Elsa\'s anthem "Let It Go".'
      },
      {
        id: 'q_pop_4',
        question: 'Who composed the iconic soundtrack for Star Wars, Indiana Jones, and Jurassic Park?',
        options: ['Hans Zimmer', 'John Williams', 'Ennio Morricone', 'Howard Shore'],
        correct: 1,
        hint: '54-time Oscar nominee maestro.',
        explanation: 'John Williams is legendary for scoring *Star Wars*, *Jaws*, *Indiana Jones*, *E.T.*, *Harry Potter*, and *Jurassic Park*.'
      },
      {
        id: 'q_pop_5',
        question: 'What is the fictional metal used to make Captain America\'s shield?',
        options: ['Adamantium', 'Vibranium', 'Mithril', 'Unobtainium'],
        correct: 1,
        hint: 'Originates from the African nation of Wakanda.',
        explanation: 'Vibranium is the rare Wakandan metal prized for its vibration-absorbing properties.'
      }
    ]
  },
  {
    id: 'quiz_gaming_trivia',
    title: 'Gaming & Esports History',
    category: 'Gaming',
    icon: 'fa-gamepad',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    description: 'Challenge your video game lore from classic 8-bit arcades to modern AAA open-world epics.',
    timePerQuestion: 20,
    difficulty: 'Medium',
    questions: [
      {
        id: 'q_game_1',
        question: 'What is the best-selling video game of all time (over 300 million copies sold)?',
        options: ['Tetris', 'Minecraft', 'Grand Theft Auto V', 'Wii Sports'],
        correct: 1,
        hint: 'A voxel block-building sandbox created by Mojang.',
        explanation: 'Minecraft surpassed 300 million copies sold, making it the highest-selling video game in history.'
      },
      {
        id: 'q_game_2',
        question: 'In the original *Super Mario Bros.* (1985), what was Mario\'s profession before being a plumber?',
        options: ['Carpenter', 'Electrician', 'Chef', 'Mechanic'],
        correct: 0,
        hint: 'In *Donkey Kong* (1981), he was building scaffolding.',
        explanation: 'In his original debut as "Jumpman" in *Donkey Kong*, Shigeru Miyamoto designed Mario as a carpenter.'
      },
      {
        id: 'q_game_3',
        question: 'Which game studio created the *The Witcher* series and *Cyberpunk 2077*?',
        options: ['Bethesda Game Studios', 'CD Projekt Red', 'Bioware', 'Rockstar Games'],
        correct: 1,
        hint: 'Polish game development company based in Warsaw.',
        explanation: 'CD Projekt Red developed *The Witcher 3: Wild Hunt* and *Cyberpunk 2077*.'
      },
      {
        id: 'q_game_4',
        question: 'What was the first home video game console released in 1972?',
        options: ['Atari 2600', 'Magnavox Odyssey', 'ColecoVision', 'Nintendo Entertainment System'],
        correct: 1,
        hint: 'Designed by Ralph Baer, the father of video games.',
        explanation: 'The Magnavox Odyssey, released in 1972, was the world\'s first commercial home video game console.'
      },
      {
        id: 'q_game_5',
        question: 'In *The Legend of Zelda* series, what are the three pieces of the Triforce?',
        options: [
          'Power, Wisdom, and Courage',
          'Strength, Honor, and Valor',
          'Light, Shadow, and Spirit',
          'Fire, Water, and Earth'
        ],
        correct: 0,
        hint: 'Associated with Ganon, Zelda, and Link respectively.',
        explanation: 'The Triforce consists of the Triforce of Power (Din), Wisdom (Nayru), and Courage (Farore).'
      }
    ]
  },
  {
    id: 'quiz_geography',
    title: 'World Geography & Marvels',
    category: 'Geography',
    icon: 'fa-globe-americas',
    color: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    description: 'Journey across continents, capital cities, natural wonders, and oceanic depths.',
    timePerQuestion: 20,
    difficulty: 'Medium',
    questions: [
      {
        id: 'q_geo_1',
        question: 'Which is the largest country in the world by land area?',
        options: ['Canada', 'China', 'United States', 'Russia'],
        correct: 3,
        hint: 'Spans 11 time zones across Europe and Asia.',
        explanation: 'Russia covers over 17 million square kilometers, making it by far the largest nation by land area.'
      },
      {
        id: 'q_geo_2',
        question: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correct: 2,
        hint: 'Chosen as a compromise between Sydney and Melbourne in 1908.',
        explanation: 'Canberra is the official capital of Australia, located inland between Sydney and Melbourne.'
      },
      {
        id: 'q_geo_3',
        question: 'Which river is historically recognized as the longest river in the world?',
        options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
        correct: 1,
        hint: 'Flows northwards through northeastern Africa into the Mediterranean Sea.',
        explanation: 'The Nile River (~6,650 km) has traditionally been regarded as the longest river on Earth.'
      },
      {
        id: 'q_geo_4',
        question: 'What is the deepest known location in Earth\'s oceans?',
        options: ['Puerto Rico Trench', 'Challenger Deep (Mariana Trench)', 'Java Trench', 'Sunda Trench'],
        correct: 1,
        hint: 'Located in the Western Pacific Ocean near Guam, reaching nearly 11,000 meters deep.',
        explanation: 'Challenger Deep in the Mariana Trench reaches approximately 10,994 meters (36,070 ft) below sea level.'
      },
      {
        id: 'q_geo_5',
        question: 'Mount Kilimanjaro is the highest mountain in which continent?',
        options: ['South America', 'Asia', 'Africa', 'Europe'],
        correct: 2,
        hint: 'A dormant volcano located in Tanzania.',
        explanation: 'Mount Kilimanjaro in Tanzania is Africa\'s highest peak at 5,895 meters above sea level.'
      }
    ]
  }
];

window.PRESET_QUIZZES = PRESET_QUIZZES;
