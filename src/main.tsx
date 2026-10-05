import { StrictMode, useMemo, useState, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Database,
  FileKey2,
  FolderTree,
  GitBranch,
  Layers3,
  Menu,
  Network,
  Play,
  Search,
  ShieldCheck,
  Terminal,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import './styles.css'

type Mode = 'linux' | 'sql'
type Accent = 'coral' | 'lime' | 'blue' | 'violet'
type LessonIcon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

type QueryResult = {
  headers: string[]
  rows: string[][]
}

type Lesson = {
  id: string
  title: string
  module: string
  description: string
  duration: string
  difficulty: string
  icon: LessonIcon
  accent: Accent
  kind: 'command' | 'query'
  snippet: string
  output?: string[]
  result?: QueryResult
  explanation: string
  points: string[]
  deepDive: string
  pitfall: string
}

type ModeContent = {
  label: string
  shortLabel: string
  statement: string
  intro: string
  progress: number
  completed: number
  accent: Accent
  lessons: Lesson[]
  diagramLabel: string
  diagramCaption: string
  principles: { title: string; text: string; icon: LessonIcon }[]
}

const linuxLessons: Lesson[] = [
  {
    id: 'linux-orientation',
    title: 'Se repérer dans le terminal',
    module: '01 · Les fondations',
    description: 'Comprendre où vous êtes, ce que contient un dossier et comment le shell lit votre intention.',
    duration: '8 min',
    difficulty: 'Débutant',
    icon: Terminal,
    accent: 'coral',
    kind: 'command',
    snippet: 'pwd && ls -la',
    output: ['/home/lea/lab', 'drwxr-xr-x  4 lea  staff  128  projets', '-rw-r--r--  1 lea  staff   82  notes.md'],
    explanation: 'Le shell est un interpréteur : il reçoit une ligne, sépare les commandes, puis transmet chaque action au système. Vous n’avez pas besoin de tout mémoriser pour commencer ; vous devez savoir lire le contexte.',
    points: ['pwd affiche le dossier courant.', 'ls liste son contenu.', '&& enchaîne la deuxième commande seulement si la première réussit.'],
    deepDive: 'Un chemin relatif part du dossier courant. Un chemin absolu commence à la racine / et reste donc stable quel que soit votre point de départ.',
    pitfall: 'Confondre le dossier affiché par le prompt avec le dossier réellement courant : utilisez pwd dès que vous avez un doute.',
  },
  {
    id: 'linux-files',
    title: 'Déplacer et manipuler des fichiers',
    module: '02 · Le système de fichiers',
    description: 'Construire des chemins fiables avec cd, mkdir, cp, mv et rm, sans perdre le fil.',
    duration: '12 min',
    difficulty: 'Débutant',
    icon: FolderTree,
    accent: 'lime',
    kind: 'command',
    snippet: 'cd projets && mkdir archive && cp notes.md archive/',
    output: ['projets/', '└── archive/', '    └── notes.md  (copie créée)'],
    explanation: 'Linux représente les dossiers comme un arbre. Chaque commande agit sur un chemin ; apprendre à le formuler est plus important que d’apprendre une longue liste d’options.',
    points: ['cd change le contexte de travail.', 'mkdir crée un dossier.', 'cp copie ; mv déplace ou renomme ; rm supprime.'],
    deepDive: 'Le caractère . désigne le dossier courant, .. son parent, et ~ votre dossier personnel. Ces raccourcis rendent les scripts portables.',
    pitfall: 'Lancer rm avec un chemin trop large. Vérifiez toujours pwd et ls avant une suppression.',
  },
  {
    id: 'linux-permissions',
    title: 'Lire les permissions',
    module: '03 · Droits & sécurité',
    description: 'Voir qui peut lire, modifier ou exécuter un fichier — et pourquoi Linux vous protège.',
    duration: '14 min',
    difficulty: 'Intermédiaire',
    icon: ShieldCheck,
    accent: 'blue',
    kind: 'command',
    snippet: 'chmod u+x deploy.sh && ls -l deploy.sh',
    output: ['-rwxr--r--  1 lea  staff  642  deploy.sh', '      ↑ le propriétaire peut maintenant exécuter le script'],
    explanation: 'Chaque fichier possède trois groupes de droits : propriétaire, groupe et autres. Les lettres r, w et x indiquent lire, écrire et exécuter.',
    points: ['u concerne le propriétaire.', 'g concerne le groupe ; o les autres utilisateurs.', 'chmod modifie les droits sans changer le contenu.'],
    deepDive: 'La notation numérique 755 encode r=4, w=2, x=1 : 7 pour le propriétaire, 5 pour le groupe, 5 pour les autres.',
    pitfall: 'Utiliser chmod 777 pour “faire marcher” un programme : cela masque souvent le vrai problème et ouvre trop de droits.',
  },
  {
    id: 'linux-processes',
    title: 'Observer les processus',
    module: '04 · Processus & réseau',
    description: 'Comprendre ce qui tourne réellement et relier un processus à une action concrète.',
    duration: '15 min',
    difficulty: 'Intermédiaire',
    icon: Workflow,
    accent: 'violet',
    kind: 'command',
    snippet: 'ps aux | grep node',
    output: ['lea   1842  0.4  1.2  node server.js', 'lea   1931  0.0  0.1  grep node', '→ le processus 1842 écoute encore'],
    explanation: 'Un programme lancé devient un processus avec un identifiant (PID). Les pipes | relient la sortie d’une commande à l’entrée de la suivante.',
    points: ['ps observe les processus.', 'grep filtre du texte.', '| compose de petites commandes spécialisées.'],
    deepDive: 'Cette philosophie de composition rend le shell puissant : chaque outil fait une chose claire, et les flux standard permettent de les combiner.',
    pitfall: 'Tuer un processus sans vérifier son PID. Un filtre trop large peut sélectionner le mauvais programme.',
  },
]

const sqlLessons: Lesson[] = [
  {
    id: 'sql-select',
    title: 'Lire une table avec SELECT',
    module: '01 · Les fondations',
    description: 'Comprendre une table, choisir des colonnes et voir la donnée comme une relation structurée.',
    duration: '8 min',
    difficulty: 'Débutant',
    icon: Database,
    accent: 'coral',
    kind: 'query',
    snippet: 'SELECT name, role FROM users;',
    result: { headers: ['name', 'role'], rows: [['Ada Lovelace', 'admin'], ['Linus Torvalds', 'editor'], ['Grace Hopper', 'viewer']] },
    explanation: 'Une requête SQL décrit le résultat voulu. SELECT choisit les colonnes ; FROM indique la table source. La base se charge du parcours des lignes.',
    points: ['Une table rassemble des lignes et des colonnes.', 'SELECT choisit quoi afficher.', 'FROM indique où chercher.'],
    deepDive: 'L’ordre logique d’une requête commence par FROM, puis WHERE, GROUP BY, HAVING, SELECT et enfin ORDER BY — même si on écrit SELECT en premier.',
    pitfall: 'Utiliser SELECT * partout : pratique pour explorer, mais fragile et coûteux dans une application qui évolue.',
  },
  {
    id: 'sql-filter',
    title: 'Filtrer avec WHERE',
    module: '02 · Explorer la donnée',
    description: 'Passer d’un inventaire complet à une question précise avec des conditions lisibles.',
    duration: '10 min',
    difficulty: 'Débutant',
    icon: Search,
    accent: 'lime',
    kind: 'query',
    snippet: "SELECT name, role FROM users WHERE status = 'active';",
    result: { headers: ['name', 'role'], rows: [['Ada Lovelace', 'admin'], ['Linus Torvalds', 'editor']] },
    explanation: 'WHERE retire les lignes qui ne répondent pas à la condition. Vous ne changez pas les données : vous réduisez l’ensemble sur lequel la question porte.',
    points: ['= compare une valeur.', 'AND exige deux conditions ; OR en accepte une.', 'Les textes se mettent entre apostrophes.'],
    deepDive: 'Les NULL ne se comparent pas avec =. Utilisez IS NULL ou IS NOT NULL : NULL signifie “inconnu”, pas “vide”.',
    pitfall: 'Oublier les apostrophes autour d’une chaîne, ou écrire = NULL au lieu de IS NULL.',
  },
  {
    id: 'sql-join',
    title: 'Relier avec JOIN',
    module: '03 · Relier les tables',
    description: 'Faire dialoguer des tables grâce à leurs clés, sans recopier la même information partout.',
    duration: '16 min',
    difficulty: 'Intermédiaire',
    icon: GitBranch,
    accent: 'blue',
    kind: 'query',
    snippet: 'SELECT users.name, teams.name FROM users JOIN teams ON users.team_id = teams.id;',
    result: { headers: ['users.name', 'teams.name'], rows: [['Ada Lovelace', 'Platform'], ['Linus Torvalds', 'Systems'], ['Grace Hopper', 'Platform']] },
    explanation: 'Une relation relie une clé étrangère à une clé primaire. JOIN reconstruit la vue utile au moment de la lecture, au lieu de dupliquer les noms d’équipe dans chaque ligne.',
    points: ['ON décrit la correspondance entre les tables.', 'INNER JOIN garde les correspondances trouvées.', 'LEFT JOIN conserve aussi les lignes sans correspondance.'],
    deepDive: 'Le choix du JOIN exprime une règle métier : “uniquement ce qui correspond” ou “tout ce qui existe, même incomplet”.',
    pitfall: 'Joindre sur une colonne qui n’est pas unique et multiplier les lignes sans le vouloir.',
  },
  {
    id: 'sql-group',
    title: 'Résumer avec GROUP BY',
    module: '04 · Décider avec la donnée',
    description: 'Transformer des lignes en signal : compter, additionner et comparer des groupes.',
    duration: '18 min',
    difficulty: 'Intermédiaire',
    icon: Layers3,
    accent: 'violet',
    kind: 'query',
    snippet: 'SELECT role, COUNT(*) AS total FROM users GROUP BY role;',
    result: { headers: ['role', 'total'], rows: [['admin', '1'], ['editor', '1'], ['viewer', '1']] },
    explanation: 'GROUP BY fabrique un groupe par valeur, puis une fonction d’agrégation résume chaque groupe. C’est le pont entre une table brute et une décision.',
    points: ['COUNT compte les lignes.', 'SUM, AVG, MIN et MAX résument des nombres.', 'Chaque colonne sélectionnée doit être groupée ou agrégée.'],
    deepDive: 'HAVING filtre après l’agrégation, alors que WHERE filtre avant. Cette différence change le niveau auquel votre question est posée.',
    pitfall: 'Mettre une condition sur COUNT dans WHERE : l’agrégat n’existe qu’après GROUP BY, donc utilisez HAVING.',
  },
]

const modes: Record<Mode, ModeContent> = {
  linux: {
    label: 'Linux',
    shortLabel: 'LINUX',
    statement: 'Comprendre la machine, pas seulement les commandes.',
    intro: 'Un parcours guidé pour lire un système, agir avec le terminal et savoir ce qui se passe sous la surface.',
    progress: 32,
    completed: 2,
    accent: 'coral',
    lessons: linuxLessons,
    diagramLabel: 'filesystem /home/lea',
    diagramCaption: 'Un système de fichiers est un arbre : chaque commande part d’un emplacement précis.',
    principles: [
      { title: 'Le shell orchestre', text: 'Des outils simples deviennent puissants quand leurs sorties se combinent.', icon: Terminal },
      { title: 'Tout a un chemin', text: 'Un fichier n’est jamais “magique” : il vit à un endroit que vous pouvez inspecter.', icon: FolderTree },
      { title: 'Les droits protègent', text: 'Lire, écrire et exécuter sont trois permissions distinctes.', icon: ShieldCheck },
    ],
  },
  sql: {
    label: 'SQL',
    shortLabel: 'SQL',
    statement: 'Poser de meilleures questions à la donnée.',
    intro: 'Des tables aux jointures, apprenez à faire parler une base sans deviner ce qu’elle fait à votre place.',
    progress: 24,
    completed: 1,
    accent: 'blue',
    lessons: sqlLessons,
    diagramLabel: 'schema / atelier',
    diagramCaption: 'Une base relie des tables spécialisées pour éviter la répétition et préserver le sens.',
    principles: [
      { title: 'Une table décrit', text: 'Chaque colonne porte un type et chaque ligne une occurrence.', icon: Database },
      { title: 'Une question filtre', text: 'Une requête précise réduit le bruit avant de produire un résultat.', icon: Search },
      { title: 'Une clé relie', text: 'Les relations assemblent les informations sans les recopier.', icon: GitBranch },
    ],
  },
}

function App() {
  const [mode, setMode] = useState<Mode>('linux')
  const [activeLessonId, setActiveLessonId] = useState(linuxLessons[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [completedIds, setCompletedIds] = useState<string[]>(['linux-orientation', 'linux-files', 'sql-select'])
  const [toast, setToast] = useState('')

  const content = modes[mode]
  const completedForMode = completedIds.filter((id) => content.lessons.some((lesson) => lesson.id === id)).length
  const activeLesson = content.lessons.find((lesson) => lesson.id === activeLessonId) ?? content.lessons[0]
  const filteredLessons = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return content.lessons
    return content.lessons.filter((lesson) => (lesson.title + ' ' + lesson.module).toLowerCase().includes(needle))
  }, [content.lessons, search])

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode)
    setActiveLessonId(modes[nextMode].lessons[0].id)
    setSearch('')
    setSidebarOpen(false)
  }

  const selectLesson = (id: string) => {
    setActiveLessonId(id)
    setSidebarOpen(false)
    window.setTimeout(() => document.getElementById('lesson-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const toggleCompleted = () => {
    setCompletedIds((ids) => ids.includes(activeLesson.id) ? ids.filter((id) => id !== activeLesson.id) : [...ids, activeLesson.id])
    setToast(completedIds.includes(activeLesson.id) ? 'Leçon remise dans le parcours.' : 'Leçon marquée comme comprise.')
    window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className={'app-shell app-shell--' + mode}>
      <aside className={'sidebar ' + (sidebarOpen ? 'sidebar--open' : '')}>
        <div className="brand-row"><a href="#top" className="brand" onClick={() => setSidebarOpen(false)}><span className="brand-mark"><Code2 size={18} strokeWidth={2.4} /></span><span>field<span className="brand-slash">/</span>guide</span></a><button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu"><X size={18} /></button></div>
        <div className="sidebar-intro"><span className="sidebar-label">Atelier technique</span><p>Du premier prompt à la lecture d’un système.</p></div>
        <div className="mode-switch" role="group" aria-label="Choisir un parcours">
          <button className={'mode-button ' + (mode === 'linux' ? 'mode-button--active' : '')} onClick={() => changeMode('linux')} aria-pressed={mode === 'linux'}><span className="mode-icon"><Terminal size={16} /></span><span><strong>Linux</strong><small>Le système</small></span><ChevronRight size={15} /></button>
          <button className={'mode-button ' + (mode === 'sql' ? 'mode-button--active' : '')} onClick={() => changeMode('sql')} aria-pressed={mode === 'sql'}><span className="mode-icon"><Database size={16} /></span><span><strong>SQL</strong><small>La donnée</small></span><ChevronRight size={15} /></button>
        </div>
        <div className="sidebar-path"><div className="path-heading"><span className="sidebar-label">Parcours {content.label}</span><span className="path-count">{content.lessons.length} leçons</span></div><nav className="lesson-nav" aria-label={'Leçons ' + content.label}>
          {content.lessons.map((lesson, index) => { const Icon = lesson.icon; const isActive = lesson.id === activeLesson.id; const isDone = completedIds.includes(lesson.id); return <button key={lesson.id} className={'lesson-nav-item ' + (isActive ? 'lesson-nav-item--active' : '')} onClick={() => selectLesson(lesson.id)} aria-current={isActive ? 'step' : undefined}><span className={'lesson-nav-index ' + (isDone ? 'lesson-nav-index--done' : '')}>{isDone ? <Check size={12} strokeWidth={3} /> : String(index + 1).padStart(2, '0')}</span><span className="lesson-nav-icon"><Icon size={15} /></span><span className="lesson-nav-copy"><strong>{lesson.title}</strong><small>{lesson.duration} · {lesson.difficulty}</small></span></button> })}
        </nav></div>
        <div className="sidebar-bottom"><div className="progress-card"><div className="progress-card-top"><span>Progression globale</span><strong>{content.progress}%</strong></div><div className="progress-track"><span style={{ width: content.progress + '%' }} /></div><small>{completedForMode} repères déjà posés · continuez à votre rythme</small></div><button className="help-link" onClick={() => setToast('Astuce : utilisez / pour retrouver rapidement une leçon.')}><CircleHelp size={16} /><span>Comment apprendre ici ?</span></button></div>
      </aside>
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Fermer le menu" onClick={() => setSidebarOpen(false)} />}
      <main className="main-column" id="top">
        <header className="topbar"><div className="topbar-left"><button className="icon-button menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu"><Menu size={20} /></button><div className="breadcrumb"><span>Atelier</span><span>/</span><strong>{content.label}</strong></div></div><div className="topbar-actions"><label className="search-field"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une leçon" aria-label="Rechercher une leçon" /><kbd>/</kbd></label><button className="icon-button top-help" onClick={() => setToast('Chaque leçon alterne explication, schéma et pratique.')} aria-label="À propos de la méthode"><CircleHelp size={18} /></button><span className="profile-dot">EL</span></div></header>
        <div className="page-scroll"><div className="content-wrap">
          <section className="intro-grid"><div className="intro-copy"><h1>{content.statement}</h1><p>{content.intro}</p><div className="intro-actions"><button className="button button--primary" onClick={() => document.getElementById('lesson-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Commencer la leçon <ArrowRight size={16} /></button><span className="intro-note"><Zap size={15} /> Explications courtes, profondeur à la demande</span></div></div><div className={'field-diagram field-diagram--' + mode} aria-label={content.diagramCaption}><div className="diagram-topline"><span>{content.diagramLabel}</span><span className="diagram-status"><span /> démo interactive</span></div>{mode === 'linux' ? <LinuxDiagram /> : <SqlDiagram />}<p>{content.diagramCaption}</p></div></section>
          <section className="quick-stats" aria-label="Résumé du parcours"><div className="quick-stat"><span className="stat-symbol stat-symbol--coral"><BookOpen size={16} /></span><span><strong>{content.lessons.length} étapes</strong><small>un fil continu, sans prérequis</small></span></div><div className="quick-stat"><span className="stat-symbol stat-symbol--lime"><Code2 size={16} /></span><span><strong>Du concept au geste</strong><small>un exemple réel à chaque étape</small></span></div><div className="quick-stat"><span className="stat-symbol stat-symbol--blue"><Network size={16} /></span><span><strong>Les liens comptent</strong><small>les idées s’emboîtent pour durer</small></span></div></section>
          <section className="learning-layout" id="lesson-lab"><div className="lesson-column"><div className="section-heading"><div><span className="section-label">Maintenant</span><h2>Une idée, puis la preuve.</h2></div><span className="lesson-counter">{String(content.lessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1).padStart(2, '0')} / {String(content.lessons.length).padStart(2, '0')}</span></div><article className="lesson-panel"><div className="lesson-panel-header"><div className={'lesson-stamp lesson-stamp--' + activeLesson.accent}>{(() => { const Icon = activeLesson.icon; return <Icon size={19} /> })()}</div><div className="lesson-title"><h3>{activeLesson.title}</h3><span>{activeLesson.module} · {activeLesson.duration}</span><p>{activeLesson.description}</p></div><span className="difficulty-badge">{activeLesson.difficulty}</span></div><div className="lesson-panel-body"><div className="lesson-explanation"><p>{activeLesson.explanation}</p><ul>{activeLesson.points.map((point) => <li key={point}><span><Check size={12} strokeWidth={3} /></span>{point}</li>)}</ul></div><LessonLab key={activeLesson.id} lesson={activeLesson} mode={mode} onToast={setToast} /></div><div className="lesson-panel-footer"><div><strong>Pour aller plus loin</strong><p>{activeLesson.deepDive}</p></div><button className={'button ' + (completedIds.includes(activeLesson.id) ? 'button--completed' : 'button--secondary')} onClick={toggleCompleted}>{completedIds.includes(activeLesson.id) ? <><Check size={15} />Compris</> : <>Marquer comme compris <ArrowRight size={15} /></>}</button></div></article></div>
            <aside className="side-column"><section className="path-panel"><div className="section-heading section-heading--small"><div><span className="section-label">Le fil</span><h2>Le parcours complet</h2></div><BookOpen size={18} /></div><div className="path-list">{filteredLessons.length === 0 ? <p className="empty-state">Aucune leçon ne correspond à “{search}”.</p> : filteredLessons.map((lesson) => <button key={lesson.id} className={'path-row ' + (lesson.id === activeLesson.id ? 'path-row--active' : '')} onClick={() => selectLesson(lesson.id)}><span className="path-row-marker" /><span className="path-row-copy"><strong>{lesson.title}</strong><small>{lesson.module} · {lesson.duration}</small></span>{completedIds.includes(lesson.id) ? <Check className="path-row-check" size={15} /> : <ChevronRight className="path-row-arrow" size={16} />}</button>)}</div><div className="path-tip"><span><FileKey2 size={15} /></span><p><strong>Le bon réflexe</strong> : expliquez chaque commande ou clause avec vos propres mots avant de passer à la suite.</p></div></section><section className="pitfall-panel"><span className="pitfall-icon"><ShieldCheck size={18} /></span><div><span className="section-label">À ne pas confondre</span><h2>Le piège du jour</h2><p>{activeLesson.pitfall}</p></div></section></aside>
          </section>
          <section className="principles-section"><div className="section-heading"><div><span className="section-label">La carte mentale</span><h2>Trois repères pour ne pas apprendre par cœur.</h2></div><span className="principles-mark">{mode === 'linux' ? 'shell' : 'relations'}</span></div><div className="principles-grid">{content.principles.map((principle, index) => { const Icon = principle.icon; return <article className={'principle principle--' + ['coral', 'lime', 'blue'][index]} key={principle.title}><span className="principle-icon"><Icon size={18} /></span><h3>{principle.title}</h3><p>{principle.text}</p></article> })}</div></section>
          <footer className="page-footer"><span>Contenu pédagogique de démonstration · à enrichir avec vos cas réels</span><span>field/guide · v0.2</span></footer>
        </div></div>
      </main>
      {toast && <div className="toast" role="status"><Check size={15} />{toast}</div>}
    </div>
  )
}

function LessonLab({ lesson, mode, onToast }: { lesson: Lesson; mode: Mode; onToast: (message: string) => void }) {
  const [value, setValue] = useState(lesson.snippet)
  const [hasRun, setHasRun] = useState(false)
  const run = () => { setHasRun(true); onToast(mode === 'linux' ? 'Commande exécutée dans le bac à sable.' : 'Requête exécutée sur le jeu de données de démonstration.') }
  return <div className={'lab-window lab-window--' + mode}><div className="lab-toolbar"><span className="lab-dots"><span /><span /><span /></span><span className="lab-title">{mode === 'linux' ? 'bash — ~/lab' : 'psql — atelier_demo'}</span><span className="lab-live"><span /> local</span></div><div className="lab-editor"><span className="lab-prompt">{mode === 'linux' ? '$' : 'sql>'}</span><input aria-label={mode === 'linux' ? 'Commande Linux' : 'Requête SQL'} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && run()} spellCheck={false} /><button className="run-button" onClick={run}><Play size={13} fill="currentColor" />Exécuter</button></div><div className={'lab-result ' + (hasRun ? 'lab-result--visible' : '')}><div className="result-label"><span>sortie</span><span>{hasRun ? 'réponse reçue' : 'aperçu du résultat'}</span></div>{mode === 'linux' ? <pre>{lesson.output?.join('\n')}</pre> : <QueryTable result={lesson.result!} />}</div><div className="lab-caption"><span className="caption-line" />{mode === 'linux' ? 'Le terminal est un dialogue : commande → sortie → prochaine question.' : 'SQL décrit le résultat ; la base parcourt les lignes pour le produire.'}</div></div>
}

function QueryTable({ result }: { result: QueryResult }) {
  return <div className="query-table-wrap"><table><thead><tr>{result.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{result.rows.map((row, rowIndex) => <tr key={row.join('-') + '-' + rowIndex}>{row.map((cell, cellIndex) => <td key={cell + '-' + cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
}

function LinuxDiagram() {
  return <div className="diagram-canvas diagram-canvas--linux"><div className="tree-root"><span className="tree-node tree-node--root">/</span><span className="tree-line" /><div className="tree-branch"><span className="tree-node tree-node--folder">home</span><span className="tree-line tree-line--short" /><div className="tree-branch tree-branch--inner"><span className="tree-node tree-node--folder">lea</span><span className="tree-line tree-line--short" /><div className="tree-files"><span className="tree-file tree-file--active"><Terminal size={12} /> lab</span><span className="tree-file"><FolderTree size={12} /> projets</span><span className="tree-file"><Code2 size={12} /> notes.md</span></div></div></div></div><div className="diagram-callout diagram-callout--linux"><span>pwd</span><strong>/home/lea/lab</strong></div></div>
}

function SqlDiagram() {
  return <div className="diagram-canvas diagram-canvas--sql"><div className="schema-table schema-table--users"><div className="schema-head"><Database size={12} /> users</div><span><b>id</b><small>PK</small></span><span>name</span><span><b>team_id</b><small>FK</small></span></div><div className="schema-table schema-table--teams"><div className="schema-head"><Layers3 size={12} /> teams</div><span><b>id</b><small>PK</small></span><span>name</span></div><svg className="schema-link" viewBox="0 0 200 100" aria-hidden="true"><path d="M8 39 C65 39 70 66 116 66" /><circle cx="8" cy="39" r="3" /><circle cx="116" cy="66" r="3" /></svg><div className="diagram-callout diagram-callout--sql"><span>JOIN</span><strong>users.team_id = teams.id</strong></div></div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
