const templates = {
  desktop: {
    default: {
      url: 'https://github.com/open-data-plan/desktop-template/archive/master.zip',
      des: 'SPA - single page application',
    },
    simple: {
      url: 'https://github.com/open-data-plan/desktop-template/archive/simple.zip',
      des: 'simple - simple react application',
    },
    mpa: {
      url: 'https://github.com/open-data-plan/desktop-template/archive/mpa.zip',
      des: 'MPA - multi page application',
    },
  },
  mobile: {
    default: {
      url: 'https://github.com/open-data-plan/mobile-template/archive/master.zip',
      des: 'SPA - single page application',
    },
    simple: {
      url: 'https://github.com/open-data-plan/mobile-template/archive/simple.zip',
      des: 'simple - simple react application',
    },
    mpa: {
      url: 'https://github.com/open-data-plan/mobile-template/archive/mpa.zip',
      des: 'MPA - multi page application',
    },
  },
  component: {
    default: {
      url: 'https://github.com/open-data-plan/component-template/archive/master.zip',
      des: 'Individual component template',
    },
    lerna: {
      url: 'https://github.com/open-data-plan/component-template/archive/lerna.zip',
      des: 'Template for mono repo',
    },
  },
  lib: {
    default: {
      url: 'https://github.com/open-data-plan/lib-template/archive/master.zip',
      des: 'Individual lib template',
    },
    lerna: {
      url: 'https://github.com/open-data-plan/lib-template/archive/lerna.zip',
      des: 'Template for mono repo',
    },
  },
}

const getTemplate = (type) => {
  return templates[type]
}

module.exports = getTemplate
