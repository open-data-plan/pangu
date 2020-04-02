const templates = {
  desktop: {
    default: {
      url:
        'https://github.com/open-data-plan/desktop-template/repository/archive',
      des: 'SPA - single page application',
    },
    simple: {
      url:
        'https://github.com/open-data-plan/desktop-template/repository/simple/archive.zip',
      des: 'simple - simple react application',
    },
    mpa: {
      url:
        'https://github.com/open-data-plan/desktop-template/repository/mpa/archive.zip',
      des: 'MPA - multi page application',
    },
  },
  mobile: {
    default: {
      url:
        'https://github.com/open-data-plan/mobile-template/repository/archive',
      des: 'SPA - single page application',
    },
    simple: {
      url:
        'https://github.com/open-data-plan/mobile-template/repository/simple/archive.zip',
      des: 'simple - simple react application',
    },
    mpa: {
      url:
        'https://github.com/open-data-plan/mobile-template/repository/mpa/archive.zip',
      des: 'MPA - multi page application',
    },
  },
  component: {
    default: {
      url:
        'https://github.com/open-data-plan/component-template/repository/archive',
      des: 'Individual component template',
    },
    lerna: {
      url:
        'https://github.com/open-data-plan/component-template/repository/lerna/archive.zip',
      des: 'Template for mono repo',
    },
  },
  lib: {
    default: {
      url: 'https://github.com/open-data-plan/lib-template/repository/archive',
      des: 'Individual lib template',
    },
    lerna: {
      url:
        'https://github.com/open-data-plan/lib-template/repository/lerna/archive.zip',
      des: 'Template for mono repo',
    },
  },
}

const getTemplate = type => {
  return templates[type]
}

module.exports = getTemplate
