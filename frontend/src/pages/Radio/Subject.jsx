import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const subjects = [
  'Mathematics',
  'English',
  'Biology',
  'Chemistry',
  'Physics',
  'Social Studies',
  'Geography',
  'History',
  'ICT',
  'French',
  'Literature',
  'Economics',
  'Civic Education',
];
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
const fromSlug = (sl) => subjects.find((s) => slug(s) === sl) || sl;

const topicsMap = {
  Mathematics: ['Fractions', 'Decimals', 'Algebra Basics'],
  English: ['Summary Writing', 'Comprehension', 'Tenses'],
  Biology: ['Photosynthesis', 'Cell Structure', 'Genetics'],
  Chemistry: ['Acids and Bases', 'Periodic Table', 'Chemical Bonding'],
  Physics: ['Newton’s Laws', 'Kinematics', 'Energy'],
  'Social Studies': ['Citizenship', 'Democracy', 'Culture'],
  Geography: ['Map Reading', 'Climate', 'Population'],
  History: ['Industrial Revolution', 'Colonial Era', 'World Wars'],
  ICT: ['Data Structures', 'Networking', 'Databases'],
  French: ['Conjugation Aller', 'Vocabulaire', 'Prononciation'],
  Literature: ['Themes', 'Motifs', 'Poetic Devices'],
  Economics: ['Supply and Demand', 'Markets', 'Inflation'],
  'Civic Education': ['Rule of Law', 'Accountability', 'Governance'],
};

function defaultNotes(subject, topic) {
  const map = {
    Mathematics: {
      Fractions:
        'Fractions represent parts of a whole. When adding or subtracting fractions, first convert them to have a common denominator, then operate on the numerators and simplify by dividing both numerator and denominator by their greatest common divisor. Mixed numbers can be converted to improper fractions for easier computation. Practice simplifying results to lowest terms and watch for opportunities to cancel factors in multiplication.',
      Decimals:
        'Decimals are another way to express fractions using powers of ten. Converting a fraction to a decimal involves dividing the numerator by the denominator. For place value, digits to the right of the decimal point represent tenths, hundredths, thousandths, and so on. Rounding decimals requires identifying the target place and checking the next digit. Operations with decimals follow normal rules—align decimal points for addition and subtraction.',
      'Algebra Basics':
        'Algebra uses variables to represent unknown quantities. Start by isolating the variable through inverse operations: add or subtract to move constants, and multiply or divide to remove coefficients. Maintain balance by applying operations to both sides of the equation. Understand and apply properties—commutative, associative, and distributive—to restructure expressions. Check solutions by substitution to verify correctness.',
    },
    English: {
      'Summary Writing':
        'A summary condenses a passage by focusing on the central idea and key supporting points while removing examples and minor details. Read the text to identify its thesis, then outline the main sections or arguments. Use your own words to avoid copying, and keep sentences concise. Ensure logical flow and coherence, and conclude with a statement that captures the overall message without personal opinion.',
      Comprehension:
        'Comprehension involves understanding literal information and making inferences. Skim the passage for structure, then scan for specific details and keywords. Pay attention to context clues for unfamiliar vocabulary and tone shifts across paragraphs. Answer questions by referencing evidence from the text, and distinguish between what the text states explicitly and what it implies.',
      Tenses:
        'Verb tense indicates time and aspect of actions. Simple tenses (past, present, future) state facts; progressive forms show ongoing actions; perfect tenses link past events to present or future relevance. Maintain consistent tense within a paragraph, unless there is a clear shift in time. Watch for sequence of tenses when reporting speech or writing narratives.',
    },
    Biology: {
      Photosynthesis:
        'Photosynthesis is the process by which plants convert light energy into chemical energy, primarily in the chloroplasts. Chlorophyll absorbs light, driving the light-dependent reactions that produce ATP and NADPH; the Calvin cycle then fixes carbon dioxide into glucose. Factors such as light intensity, carbon dioxide concentration, and temperature affect the rate. Photosynthesis releases oxygen and sustains the energy base for most ecosystems.',
      'Cell Structure':
        'Cells are the fundamental units of life. Eukaryotic cells contain membrane-bound organelles: the nucleus houses genetic material, mitochondria generate ATP, the endoplasmic reticulum and Golgi apparatus process and package proteins, and lysosomes handle waste. Plant cells additionally have chloroplasts, a central vacuole, and a rigid cell wall. The cell membrane regulates transport via diffusion, osmosis, and active transport.',
      Genetics:
        'Genetics studies heredity and variation. Mendelian inheritance describes how dominant and recessive alleles pass from parents to offspring, following principles of segregation and independent assortment. Genotypes determine phenotypes, but environment can modulate expression. Modern genetics includes DNA structure, replication, and the central dogma: DNA to RNA to protein. Mutations introduce variation, which fuels evolution.',
    },
    Chemistry: {
      'Acids and Bases':
        'Acids donate protons (H+) and bases accept them, as defined by Brønsted–Lowry. The pH scale measures acidity from 0 to 14, with 7 as neutral. Strong acids and bases dissociate completely, while weak ones partially. Neutralization reactions produce water and salts. Buffer solutions resist pH changes by using conjugate acid–base pairs; they are essential in biological systems.',
      'Periodic Table':
        'The periodic table organizes elements by atomic number and electron configuration. Groups share similar chemical properties due to valence electrons. Trends include atomic radius decreasing across a period and increasing down a group, ionization energy showing the inverse trend, and electronegativity peaking near fluorine. Transition metals exhibit multiple oxidation states and form colored compounds.',
      'Chemical Bonding':
        'Chemical bonding arises from electron interactions. Ionic bonds result from electron transfer forming charged ions that attract electrostatically; covalent bonds involve shared electron pairs and can be polar or nonpolar. Metallic bonding features a lattice of cations in a sea of delocalized electrons, explaining conductivity and malleability. Intermolecular forces—hydrogen bonding, dipole–dipole, and London dispersion—affect boiling points and solubility.',
    },
    Physics: {
      'Newton’s Laws':
        'Newton’s Laws of Motion describe how forces affect motion. The first law states an object remains at rest or uniform motion unless acted upon by a net force. The second law relates force, mass, and acceleration (F=ma). The third law asserts every action has an equal and opposite reaction. Apply free-body diagrams to analyze forces, and remember friction and air resistance can significantly influence outcomes.',
      Kinematics:
        'Kinematics studies motion without considering forces. Displacement, velocity, and acceleration describe position changes over time. For constant acceleration, use equations of motion to relate these quantities. Graphs of position–time and velocity–time reveal trends; slope indicates velocity or acceleration respectively. Projectiles exhibit parabolic trajectories, with horizontal and vertical motions analyzed independently.',
      Energy:
        'Energy exists in forms such as kinetic, potential, thermal, and chemical. The work–energy theorem connects work to changes in kinetic energy. Conservation of energy states total energy remains constant in isolated systems, transforming from one form to another. Potential energy includes gravitational and elastic types; power measures the rate of energy transfer. Efficiency compares useful output to input.',
    },
    'Social Studies': {
      Citizenship:
        'Citizenship involves rights, responsibilities, and active participation in civic life. Responsible citizens respect laws, pay taxes, vote, and contribute to community welfare. They uphold tolerance and inclusivity, and they engage in dialogue to address public issues. Education and awareness strengthen the ability to hold institutions accountable and promote social justice.',
      Democracy:
        'Democracy is governance by the people, featuring free and fair elections, rule of law, and separation of powers. It relies on transparency, accountability, and protection of minority rights. Civil society and independent media facilitate participation and oversight. Strong democracies encourage deliberation and compromise while safeguarding constitutional principles.',
      Culture:
        'Culture encompasses shared beliefs, practices, language, and customs that shape identity. It evolves over time through contact, innovation, and adaptation. Cultural diversity enriches societies but requires respect and intercultural competence to avoid prejudice. Understanding cultural frameworks helps interpret behaviors and societal norms.',
    },
    Geography: {
      'Map Reading':
        'Map reading involves understanding scale, symbols, contour lines, and orientation. Latitude measures north–south position, while longitude measures east–west. Topographic maps depict elevation through contours; close lines indicate steep terrain. Use grid references to locate points precisely, and consider projections and distortions when comparing distance and area across maps.',
      Climate:
        'Climate describes long-term weather patterns influenced by latitude, altitude, ocean currents, and atmospheric circulation. Köppen classification categorizes climates by temperature and precipitation. Climate change stems from natural cycles and human activities, notably greenhouse gas emissions, leading to impacts on ecosystems, agriculture, and sea levels.',
      Population:
        'Population geography examines distribution, density, growth, and migration. Demographic transition explains stages from high birth and death rates to lower levels as societies develop. Urbanization trends reshape land use and service demands. Policy responses address aging populations, youth bulges, and migration flows.',
    },
    History: {
      'Industrial Revolution':
        'The Industrial Revolution marked a shift from agrarian economies to mechanized production. Innovations like the steam engine and factory systems transformed labor and urban landscapes. It spurred economic growth, but also led to social challenges such as worker exploitation and environmental impacts. Reform movements and new ideologies emerged in response.',
      'Colonial Era':
        'Colonialism involved territorial control, resource extraction, and cultural imposition. It reshaped trade networks and governance structures, often marginalizing indigenous populations. Resistance, adaptation, and syncretism characterized responses. The legacies include linguistic changes, borders, and economic dependencies that influence postcolonial development.',
      'World Wars':
        'The World Wars were global conflicts with complex causes including nationalism, alliances, and economic tensions. Technological advancements changed warfare, and civilian populations faced unprecedented disruption. Post-war settlements redrew borders and established institutions aimed at collective security. The wars catalyzed social change and decolonization movements.',
    },
    ICT: {
      'Data Structures':
        'Data structures organize information for efficient access and modification. Arrays provide contiguous storage and O(1) indexing; linked lists support dynamic insertion; stacks and queues model LIFO and FIFO behavior. Trees and graphs capture hierarchical and network relationships. Choosing an appropriate structure depends on operation costs and constraints.',
      Networking:
        'Computer networking connects devices to share resources. The OSI model describes layers from physical transmission to application protocols. IP addressing and routing enable packet delivery; TCP provides reliable transport, while UDP prioritizes speed. Secure communication uses encryption and authentication. Design considerations include bandwidth, latency, and resilience.',
      Databases:
        'Databases store structured data. Relational databases use tables and SQL to enforce integrity through keys and constraints. Normalization reduces redundancy; indexing accelerates queries. NoSQL systems handle unstructured or large-scale data with flexible schemas. Transactions ensure atomicity, consistency, isolation, and durability.',
    },
    French: {
      'Conjugation Aller':
        'Le verbe “aller” exprime le déplacement et forme le futur proche. Présent: je vais, tu vas, il va, nous allons, vous allez, ils vont. Utilisez “aller” + infinitif pour indiquer une intention: “Je vais étudier.” Respectez l’accord sujet–verbe et pratiquez la prononciation des voyelles.',
      Vocabulaire:
        'Enrichir le vocabulaire nécessite la lecture régulière et l’usage contextuel. Apprenez des familles de mots et des collocations. Utilisez des synonymes et antonymes pour la précision. Les expressions idiomatiques renforcent la naturalité du discours.',
      Prononciation:
        'La prononciation française implique le contrôle des nasales (an, en, on, in), des liaisons, et des voyelles fermées/ouvertes. Écoutez des locuteurs natifs, répétez des phrases, et distinguez les sons proches. La prosodie—rythme et intonation—contribue à la fluidité.',
    },
    Literature: {
      Themes:
        'Les thèmes sont des idées centrales qui traversent une œuvre. Identifiez les conflits, les valeurs et les transformations des personnages. Analysez comment les symboles, les images et la structure renforcent le message. Comparez les thèmes entre œuvres pour éclairer des perspectives culturelles.',
      Motifs:
        'Les motifs sont des éléments récurrents—objets, couleurs, situations—qui amplifient les thèmes. Repérez leurs occurrences et leur évolution. Évaluez leur rôle dans le développement des personnages et la progression de l’intrigue.',
      'Poetic Devices':
        'Les procédés poétiques incluent la métaphore, l’allitération, l’assonance, et l’enjambement. Étudiez comment la forme (mètre, schéma de rimes) soutient le sens. Reliez les choix de langue au ton et au point de vue.',
    },
    Economics: {
      'Supply and Demand':
        'L’offre et la demande déterminent le prix d’équilibre sur un marché concurrentiel. Les déplacements des courbes résultent de facteurs tels que revenu, préférences, coûts de production et prix des biens liés. Les interventions publiques—taxes, subventions, plafonds et planchers—modifient les résultats, parfois avec des effets secondaires.',
      Markets:
        'Les structures de marché incluent concurrence parfaite, monopole, oligopole, et concurrence monopolistique. Chaque structure diffère par le nombre d’acteurs, la différenciation des produits, et les barrières à l’entrée. La stratégie des entreprises répond aux incitations de profit et aux régulations.',
      Inflation:
        'L’inflation est l’augmentation générale des prix. Elle peut être tirée par la demande ou par les coûts. Les banques centrales utilisent la politique monétaire—taux d’intérêt et masse monétaire—pour la stabiliser. Les anticipations et les chocs d’offre jouent un rôle clé dans la dynamique.',
    },
    'Civic Education': {
      'Rule of Law':
        'Le principe de l’état de droit implique que toutes les personnes et institutions, publiques et privées, sont soumises à la loi. Il exige des lois claires, stables et appliquées équitablement, des tribunaux indépendants, et des procédures régulières garantissant les droits.',
      Accountability:
        'La responsabilité publique garantit que les détenteurs de pouvoir rendent des comptes sur leurs décisions et utilisent les ressources de manière transparente. Les mécanismes incluent audits, institutions de contrôle, médias libres, et participation citoyenne.',
      Governance:
        'La gouvernance englobe les processus et structures qui déterminent la direction et la performance d’une société. Les principes clés sont la transparence, l’efficacité, l’inclusivité, et la lutte contre la corruption. Une gouvernance solide renforce la confiance et le développement durable.',
    },
  };
  return map[subject]?.[topic] || 'Add class notes here.';
}

export default function RadioSubject() {
  const { subject } = useParams();
  const displaySubject = fromSlug(subject);
  const topics = topicsMap[displaySubject] || ['Topic'];

  const [topic, setTopic] = useState(topics[0]);
  const [notes, setNotes] = useState('');
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [playing, setPlaying] = useState(false);
  const utterRef = useRef(null);

  const storageKey = useMemo(
    () => `radio:notes:${displaySubject}:${topic}`,
    [displaySubject, topic]
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setNotes(saved ?? defaultNotes(displaySubject, topic));
  }, [storageKey, displaySubject, topic]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, notes);
  }, [notes, storageKey]);

  const play = () => {
    if (!notes?.trim()) return;
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(notes);
    const v = voices[voiceIndex] || voices[0];
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setPlaying(false);
    utterRef.current = u;
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setPlaying(false);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/radio"
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Back
        </Link>
        <h2 className="text-xl font-bold text-gray-700 uppercase">
          {displaySubject}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">Topic</div>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 mb-2">Notes</div>
            <textarea
              className="w-full h-40 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Voice</div>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={voiceIndex}
              onChange={(e) => setVoiceIndex(Number(e.target.value))}
            >
              {voices.map((v, i) => (
                <option key={`${v.name}-${i}`} value={i}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Rate</div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Pitch</div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              onClick={play}
              disabled={playing}
            >
              Play
            </button>
            <button
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={pause}
            >
              Pause
            </button>
            <button
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={resume}
            >
              Resume
            </button>
            <button
              className="px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
              onClick={stop}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
