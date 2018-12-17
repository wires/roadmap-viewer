const user = 'wires';
// Generate token here: https://github.com/settings/tokens
const token = 'ed0ad757434229cee217ff19d9a8913e737474e6';
const endpoint = 'https://api.github.com';
const creds = `${user}:${token}`;
const auth = btoa(creds);

const options = {
  mode: 'cors',
  headers: {
    'Authorization': 'Basic ' + auth,
  }
}

const api = (resource) => {
  return fetch(`${endpoint}${resource}`, options)
    .then(
      response => response.json(),
      err => console.error('Error fetching', err)
    )
    .then(
      json => console.log('JSON', json),
      err => console.error('Error parsing', err)
    );
}

// Get milestones requests from this repo
api('/repos/wires/roadmap-viewer/milestones')
        .then(milestones => {
            console.log(milestones);
        })