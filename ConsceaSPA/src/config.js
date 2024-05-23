const config = {
  API_URL:
    window.location.hostname === 'yellow-dune-03857d40f.5.azurestaticapps.net'
      ? 'https://consceaapi.azurewebsites.net/api'
      : import.meta.env.VITE_API_URL,
};

export default config;
