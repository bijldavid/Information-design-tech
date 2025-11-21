import adapter from '@sveltejs/adapter-node';

const config = {
  kit: {
    adapter: adapter({
      // optional:
      out: 'build',
      precompress: false,
      envPrefix: 'PUBLIC_'
    })
  }
};

export default config;
