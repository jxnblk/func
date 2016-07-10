
const kebab = str => str.replace(/([A-Z])/g, g => '-' + g.toLowerCase())
const parseValue = prop => val => typeof val === 'number' ? addPx(prop)(val) : val
const skips = [ 'lineHeight', 'fontWeight', 'opacity', 'zIndex' ]
const addPx = prop => val => skips.includes(prop) ? val : val + 'px'

const filterNull = obj => key => obj[key] !== null
const createDec = style => key => `${kebab(key)}:${parseValue(key)(style[key])}`

const styleToString = style => Object.keys(style).filter(filterNull(style)).map(createDec(style)).join(';')
const isStyleObject = props => key => (key === 'style' && typeof props[key] === 'object')

const createStyle = props => key => isStyleObject(props)(key) ? styleToString(props[key]) : props[key]
const reduceProps = props => (a, key) => Object.assign(a, { [key]: createStyle(props)(key) })
const transformProps = props => Object.keys(props).reduce(reduceProps(props), {})

const applyProps = el => props => {
  props = transformProps(props)
  Object.keys(props).forEach(key => el.setAttribute(key, props[key]))
  return appendChildren(el)
}

const appendChildren = el => (...children) => {
  children.map(c => c instanceof Element ? c : document.createTextNode(c))
    .forEach(c => el.appendChild(c))
  return el
}

const isProps = arg => (!(arg instanceof Element) && typeof arg === 'object')
const applyPropsOrChildren = tag => (...args) => isProps(args[0])
  ? applyProps(document.createElement(tag))(args[0])
  : appendChildren(document.createElement(tag))(...args)
const h = tag => applyPropsOrChildren(tag)

const div = h('div')
const h1 = h('h1')
const p = h('p')
const ul = h('ul')
const li = h('li')
const a = h('a')

const svgEl = tag => applyProps(document.createElementNS('http://www.w3.org/2000/svg', tag))

const svg = props => d => svgEl('svg')(props)(
  svgEl('path')({ d })()
)

const avatar ='M64 0 L64 4 L76 4 L74 6 L94 14 L92 16 L104 20 L100 22 L106 28 L102 28 L106 56 Q110 62 110 70 T105 84 L96 108 C92 116 76 128 64 128 C52 128 36 116 32 108 L23 84 Q18 78 18 70 T22 56 L22 22 L26 24 L34 12 L36 16z M72 40 Q56 30 40 30 Q32 34 30 48 L30 48 L28 74 C28 81 37 102 38 104 C46 118 62 121 64 121 C66 121 82 118 90 104 C91 102 100 81 100 74 L99 52 L94 40 L92 42 L84 38 L84 42 L74 36 M44 62 A5.5 5.5 0 0 0 44 73 A5.5 5.5 0 0 0 44 62 M84 62 A5.5 5.5 0 0 0 84 73 A5.5 5.5 0 0 0 84 62 M57 88 H71 A2 2 0 0 1 71 92 H57 A2 2 0 0 1 57 88 M53 104 H75 A2 2 0 0 1 75 108 H53 A2 2 0 0 1 53 104 M33.3 60.4 C34.6 57.8 37 55.9 39.7 55.2 C43 54.4 46.8 55.3 50.4 58 C51.3 58.6 52.5 58.4 53.2 57.5 C53.8 56.6 53.6 55.4 52.7 54.7 C46.8 50.5 41.8 50.5 38.7 51.3 C34.8 52.3 31.5 54.9 29.7 58.6 C29.2 59.6 29.6 60.8 30.6 61.3 C30.9 61.4 31.2 61.5 31.5 61.5 C32.2 61.5 32.9 61.1 33.3 60.4 z M97.7 61.9 C98.5 61.2  98.6  59.9  97.9  59.1 C94.3 55  90.1  52.9  85.4  53 C82 53  78.3  54.2  74.3  56.6 C73.3 57.2  73  58.4  73.6  59.3 C74.2 60.3  75.4  60.6  76.3  60 C79.7 58  82.7  57  85.5  57 C89 57  92.1  58.5  95  61.7 C95.4 62.2  95.9  62.4  96.5  62.4 C96.8 62.4 97.3 62.2 97.7 61.9 z'

const Root = props => div({
  style: {
    fontFamily: 'Menlo, monospace',
    lineHeight: 1.75,
    padding: 32
  }
})(
  Header(props),
  Links(props),
  Projects(props)
)

const Header = props => h('header')({
  style: {
    maxWidth: 1088,
    marginBottom: 64
  }
})(
  svg({
    viewBox: '0 0 128 128',
    width: 48,
    height: 48,
    fill: 'currentcolor',
  })(avatar),
  h1({
    style: {
    }
  })(props.title),
  p({
    style: {
      fontSize: '2em',
      lineHeight: 1.5,
      marginBottom: 0,
    }
  })(props.subhead),
  p({})('Based in Brooklyn, NY')
)

const Projects = props => h('main')({
  style: {
    marginBottom: 128
  }
})(
  h('h2')('Projects'),
  ul(
    ...props.projects.map(p => li(
      a({ href: p.href })(
        h('b')(p.title),
        ' ',
        p.description
      )
    ))
  )
)

const Links = props => ul(
  ...props.links.map(l => li(
    a({ href: l.href })(l.text)
  ))
)

const html = Root({
  title: 'Jxnblk',
  subhead: 'Brent Jackson is a web designer/developer specializing in modular design systems & front-end architecture.',
  links: [
    { href: '//twitter.com/jxnblk', text: 'Twitter' },
    { href: '//twitter.com/github', text: 'GitHub' },
    { href: '//twitter.com/writing', text: 'Writing' }
  ],
  projects: [
    { href: '//jxnblk.com/rebass',
      title: 'Rebass',
      description: 'Configurable React UI components'
    },
    {
      href: '//basscss.com',
      title: 'Basscss',
      description: 'Low-level CSS toolkit'
    },
    {
      href: '//jxnblk.com/writing',
      title: 'Writing',
      description: 'Thoughts on design and development'
    },
    {
      href: '//jxnblk.com/colorable',
      title: 'Colorable',
      description: 'Color palette contrast tester'
    },
    {
      href: '//geomicons.com',
      title: 'Geomicons',
      description: 'Open source icons for the web'
    },
    {
      href: '//jxnblk.com/react-geomicons',
      title: 'React Geomicons',
      description: 'React icon component for Geomicons Open'
    },
    {
      href: '//jxnblk.com/react-icons',
      title: 'SVG Icons in React',
      description: 'How to create generative graphics in React'
    },
    {
      href: '//jxnblk.com/paths',
      title: 'Paths',
      description: 'Edit SVGs in the browser'
    },
    {
      href: '//jxnblk.com/gravitons',
      title: 'Gravitons',
      description: 'Virtually massless CSS layout microlibrary'
    },
    {
      href: '//jxnblk.com/loading',
      title: 'Loading...',
      description: 'Animated SVG loading indicators'
    },
    {
      href: '//jxnblk.com/shade',
      title: 'Shade',
      description: 'Mathematically-derived gradients'
    },
    {
      href: '//jxnblk.com/reflexbox',
      title: 'Reflexbox',
      description: 'React flexbox layout and grid system'
    },
    {
      href: '//jxnblk.com/gx',
      title: 'Gx',
      description: 'Minimal, responsive React grid system'
    },
    {
      href: '//jxnblk.com/rgx',
      title: 'Rgx',
      description: 'Constraint-based React grid system'
    },
    {
      href: '//jxnblk.com/fitter-happier-title',
      title: 'Fitter Happier Text',
      description: 'Performant, fully fluid headings'
    },
    {
      href: '//jxnblk.com/react-fitter-happier-title',
      title: 'React Fitter Happier Text',
      description: 'React component for fully fluid headings'
    },
    {
      href: '//jxnblk.com/Spectral',
      title: 'Spectral',
      description: 'Click the rainbow'
    },
    {
      href: '//jxnblk.com/vhs',
      title: 'VHS',
      description: 'Post-future CSS animations'
    },
    {
      href: '//mrsjxn.com',
      title: 'MrsJxn',
      description: 'Post-future beats'
    },
    {
      href: '//jxnblk.com/skullcat',
      title: 'Skullcat',
      description: 'Avatar and web audio experiment'
    },
    {
      href: '//jxnblk.com/work',
      title: 'Work',
      description: 'Professional work'
    },
    {
      href: '//jxnblk.com/principles',
      title: 'Principles',
      description: 'Web design principles'
    },
    {
      href: '//jxnblk.com/reading-list',
      title: 'Reading List',
      description: 'Recommended reading'
    },
    {
      href: '//jxnblk.com/Ashley',
      title: 'Ashley',
      description: 'Readable Tumblr theme'
    },
    {
      href: '//jxnblk.com/Heather',
      title: 'Heather',
      description: 'Hyperminimal Jekyll theme'
    },
    {
      href: '//jxnblk.com/Twipster',
      title: 'Twipster',
      description: 'Simpler, readabler Twitter'
    },
    {
      href: '//microbeats.cc',
      title: 'Microbeats',
      description: 'Beats created in under an hour'
    },
    {
      href: '//jxnblk.com/gifolio',
      title: 'Gifolio',
      description: 'GIF portfolio'
    },
    {
      href: '//jxnblk.com/papercraft',
      title: 'Papercraft',
      description: 'Hand-coded SVG lettering'
    },
    {
      href: '//jxnblk.com/stepkit',
      title: 'Stepkit',
      description: 'Web audio step sequencer'
    }
  ]
})

window.onload = () => {
  const meta = [
    h('meta')({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    })()
  ]
  meta.forEach(m => document.head.appendChild(m))
  document.body.appendChild(html)
}

(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create", "UA-4603832-6", "auto");ga("send", "pageview");
