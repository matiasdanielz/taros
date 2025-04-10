export const environment = {
  production: true,
  useRestApi: true,
  apiDomain: 'http://200.229.234.214:8091/rest/taros',
  apiCredentials: 'basic YWRtaW46dG90dnNAMjAyNA==',
  header: {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": '' // Definido depois
    }
  }
};

// Atribuindo após a criação do objeto
environment.header.headers.Authorization = environment.apiCredentials;