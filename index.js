
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
const applyPropsOrChildren = el => (...args) => isProps(args[0]) ? applyProps(el)(args[0]) : appendChildren(el)(...args)
const h = tag => applyPropsOrChildren(document.createElement(tag))

const Root = props => h('div')({
  style: {
    fontFamily: 'SF Mono, Roboto Mono, Menlo, monospace',
    lineHeight: 1.5,
    padding: 32,

    // fontSize: 8,
    // opacity: .25
  }
})(
  Header(props),
  Links(props),
  Projects(props)
)

const Header = props => h('header')({})(
  h('h1')(props.title),
  h('p')({
    style: {
      fontSize: '2em'
    }
  })(props.subhead)
)

const Projects = props => h('main')({})(
  h('ul')(
    ...props.projects.map(p => h('li')(
      h('a')({ href: p.href })(p.text)
    ))
  )
)

const Links = props => h('ul')(
  ...props.links.map(l => h('li')(
    h('a')({ href: l.href })(l.text)
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
    { href: 'http://jxnblk.com/rebass', text: 'Rebass' },
    { href: 'http://basscss.com', text: 'Basscss' },
    { href: 'http://jxnblk.com/writing', text: 'Writing' },
    { href: 'http://jxnblk.com/colorable', text: 'Colorable' },
    { href: 'http://geomicons.com', text: 'Geomicons' },
    { href: 'http://jxnblk.com/react-geomicons', text: 'React Geomicons' },
    { href: 'http://jxnblk.com/react-icons', text: 'SVG Icons in React' },
    { href: 'http://jxnblk.com/paths', text: 'Paths' },
  ]
})

window.onload = () => {
  console.log(html.outerHTML)
  const vpm = document.createElement('meta')
  vpm.name = 'viewport'
  vpm.content = 'width=device-width, initial-scale=1'
  document.head.appendChild(vpm)
  document.body.appendChild(html)
}

